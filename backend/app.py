from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from validate import validate_input
from steps import create_latex_steps
from solve import solve_math
from graph import generate_graph
import sympy as sp
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/calculate', methods=['POST'])
def calculate_route():
    data = request.get_json()
    operation = data.get("operation")
    expression = data.get("expression", "")
    variables = data.get("variables", ["x"])
    params = data.get("params", {})
    equations = data.get("equations", [])

    print(f"Received operation: {operation}")
    print(f"Received expression: {expression}")
    print(f"Received params: {params}")

    try:
        validate_input(operation, expression, variables, equations, params)
        result, latex_steps = solve_math(
            operation=operation,
            expression=expression,
            variables=variables,
            equations=equations,
            params=params
        )

        if isinstance(result, dict):
            latex_result = {k: sp.latex(v) if hasattr(v, 'free_symbols') else str(v) for k, v in result.items()}
        elif isinstance(result, list):
            latex_result = [sp.latex(r) if hasattr(r, 'free_symbols') else str(r) for r in result]
        elif hasattr(result, 'free_symbols') or isinstance(result, sp.Basic):
            latex_result = sp.latex(result)
        else:
            latex_result = str(result)

        try:
            numerical_result = float(result) if isinstance(result, (int, float, sp.Float)) else str(result)
        except:
            numerical_result = str(result)

        return jsonify({
            "result": latex_result,
            "steps": latex_steps,
            "numerical_result": numerical_result
        })

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 400

@app.route('/graph', methods=['POST'])
def generate_graph_route():
    try:
        data = request.get_json()
        expression = data.get("expression", "")
        if not expression:
            return jsonify({"error": "Expression is required"}), 400
        try:
            sp.sympify(expression)
        except Exception as e:
            return jsonify({"error": f"Invalid expression: {str(e)}"}), 400
        img_buffer = generate_graph(expression)
        return Response(img_buffer.getvalue(), mimetype='image/png')
    except Exception as e:
        print(f"Graph error: {str(e)}")
        return jsonify({"error": str(e)}), 400

@app.route('/supported-operations', methods=['GET'])
def get_supported_operations():
    operations = [
        "aritmatika", "persamaan", "faktorisasi", "substitusi", "statistika",
        "pecahan", "deret_aritmatika", "deret_geometri", "limit", "trigonometri",
        "turunan", "integral", "integral_tentu", "logaritma", "fungsi"
    ]
    return jsonify({
        "supported_operations": operations,
        "total_operations": len(operations)
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "Math Calculator API with Image Processing is running!",
        "features": [
            "Text-based calculations",
            "Graph generation",
            "Solution visualization"
        ]
    })

@app.route('/status')
def status():
    return "Math Calculator API with Image Processing is running!"

if __name__ == '__main__':
    app.run(debug=True)