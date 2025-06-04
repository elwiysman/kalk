import sympy as sp
import statistics
from fractions import Fraction
from steps import create_latex_steps

def solve_math(operation, expression=None, variables=['x'], equations=None, params=None):
    result = None 
    steps = [] 

    try:
        if operation == 'pecahan': 
            action = params.get("action", "simplify") 
            expr1 = params.get("expr1", "1/2") 
            expr2 = params.get("expr2", "1/3") 
            
            frac1 = sp.Rational(expr1) 
            frac2 = sp.Rational(expr2) if expr2 else None 
            
            if action == "simplify": 
                result = sp.simplify(frac1) 
            elif action == "add": 
                result = frac1 + frac2 
            elif action == "subtract": 
                result = frac1 - frac2 
            elif action == "multiply": 
                result = frac1 * frac2 
            elif action == "divide": 
                result = frac1 / frac2 
            elif action == "compare": 
                if frac1 > frac2: 
                    result = f"{sp.latex(frac1)} > {sp.latex(frac2)}" 
                elif frac1 < frac2: 
                    result = f"{sp.latex(frac1)} < {sp.latex(frac2)}" 
                else:
                    result = f"{sp.latex(frac1)} = {sp.latex(frac2)}" 
            elif action == "convert": 
                result = float(frac1) 
            else:
                result = f"Operasi {action} belum diimplementasi" 
        
        elif operation == 'aritmatika': 
            expr = sp.sympify(expression) 
            result = expr.evalf() 
        
        elif operation == 'simplify': 
            expr = sp.sympify(expression) 
            result = sp.simplify(expr)

        elif operation == 'expand': 
            expr = sp.sympify(expression) 
            result = sp.expand(expr) 

        elif operation in ['factor', 'faktorisasi']: 
            expr = sp.sympify(expression) 
            result = sp.factor(expr) 

        elif operation == 'turunan': 
            var = sp.Symbol(variables[0]) 
            expr = sp.sympify(expression) 
            result = sp.diff(expr, var) 

        elif operation == 'integral': 
            var = sp.Symbol(variables[0]) 
            expr = sp.sympify(expression) 
            result = sp.integrate(expr, var) 

        elif operation == 'integral_tentu': 
            var = sp.Symbol(variables[0]) 
            expr = sp.sympify(expression) 
            a = sp.sympify(params.get("lower_bound", 0)) 
            b = sp.sympify(params.get("upper_bound", 1)) 
            result = sp.integrate(expr, (var, a, b)) 

        elif operation == 'persamaan': 
            if isinstance(equations, list) and len(equations) > 0: 
                eq_list = [] 
                for eq in equations: 
                    if '=' in eq: 
                        left, right = eq.split('=') 
                        eq_list.append(sp.Eq(sp.sympify(left), sp.sympify(right))) 
                    else:
                        eq_list.append(sp.Eq(sp.sympify(eq), 0)) 
                
                result = sp.solve(eq_list, [sp.Symbol(v) for v in variables]) 
            else:
                if '=' in expression: 
                    left, right = expression.split('=') 
                    eq = sp.Eq(sp.sympify(left), sp.sympify(right)) 
                else:
                    eq = sp.Eq(sp.sympify(expression), 0) 
                
                result = sp.solve(eq, sp.Symbol(variables[0])) 

        elif operation == 'substitusi': 
            expr = sp.sympify(expression) 
            old_var = params.get("old_var", "x") 
            new_expr = params.get("new_expr", "1") 
            result = expr.subs(sp.Symbol(old_var), sp.sympify(new_expr)) 

        elif operation == 'logaritma': 
            base = sp.sympify(params.get("base", 10)) 
            arg = sp.sympify(expression) 
            result = sp.log(arg, base) 

        elif operation == 'statistika': 
            data = params.get("data", [1, 2, 3, 4, 5]) 
            data_type = params.get("data_type", "mean") 
            
            if data_type == "mean": 
                result = statistics.mean(data) 
            elif data_type == "median": 
                result = statistics.median(data) 
            elif data_type == "mode": 
                result = statistics.mode(data) if len(set(data)) < len(data) else "Tidak ada modus" 
            elif data_type == "variance": 
                result = statistics.variance(data) if len(data) > 1 else 0 
            elif data_type == "std_dev": 
                result = statistics.stdev(data) if len(data) > 1 else 0 
            else:
                result = statistics.mean(data) 

        elif operation == 'deret_aritmatika': 
            first_term = params.get("first_term", 1) 
            common_diff = params.get("common_diff", 1) 
            n_term = params.get("n_term", 1) 
            seq_type = params.get("seq_type", "term") 
            
            if seq_type == "term": 
                result = first_term + (n_term - 1) * common_diff 
            else:
                result = n_term / 2 * (2 * first_term + (n_term - 1) * common_diff) 

        elif operation == 'deret_geometri': 
            first_term = params.get("first_term", 1) 
            common_ratio = params.get("common_ratio", 2) 
            n_term = params.get("n_term", 1) 
            seq_type = params.get("seq_type", "term") 
            
            if seq_type == "term": 
                result = first_term * (common_ratio ** (n_term - 1)) 
            else:
                if common_ratio != 1: 
                    result = first_term * (common_ratio ** n_term - 1) / (common_ratio - 1) 
                else:
                    result = first_term * n_term 

        elif operation == 'limit': 
            var = sp.Symbol(variables[0]) 
            expr = sp.sympify(expression) 
            point = params.get("point", 0) 
            result = sp.limit(expr, var, point) 

        elif operation == 'trigonometri': 
            expr = sp.sympify(expression) 
            result = sp.trigsimp(expr) 

        elif operation == 'fungsi': 
            expr = sp.sympify(expression) 
            result = sp.simplify(expr) 

        else:
            raise ValueError(f"Operasi '{operation}' tidak dikenali.") 

        steps = create_latex_steps(operation, expression, variables, params, result) 
        return result, steps 

    except Exception as e:
        raise ValueError(f"Terjadi error saat memproses operasi '{operation}': {e}") 