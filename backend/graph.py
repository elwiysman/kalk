import sympy as sp
import numpy as np
import matplotlib.pyplot as plt
import io
import matplotlib
matplotlib.use('Agg')

plt.rc('text', usetex=False) 
plt.rc('font', family='DejaVu Sans') 
plt.rc('mathtext', fontset='dejavusans')
plt.rcParams['mathtext.default'] = 'it' 
plt.rcParams['mathtext.fontset'] = 'cm' 

def generate_graph(expression):
    print(f"Processing expression: {expression}") 
    x = sp.Symbol('x')
    try:
        expr = sp.sympify(expression)
    except Exception as e:
        raise Exception(f"Invalid expression: {str(e)}")

    latex_expr = sp.latex(expr)
    print(f"LaTeX expression: {latex_expr}")

    f = sp.lambdify(x, expr, 'numpy')
    
    x_vals = np.linspace(-10, 10, 1000)
    
    try:
        y_vals = f(x_vals)
    except:
        y_vals = []
        for x_val in x_vals:
            try:
                y_val = complex(f(x_val))
                if abs(y_val.imag) < 1e-10:
                    y_vals.append(y_val.real)
                else:
                    y_vals.append(np.nan)
            except:
                y_vals.append(np.nan)
        y_vals = np.array(y_vals)
    
    plt.figure(figsize=(10, 6))
    plt.plot(x_vals, y_vals, 'b-', linewidth=2, label=f'$f(x) = {latex_expr}$')
    plt.grid(True, alpha=0.3)
    plt.xlabel('$x$', fontsize=12) 
    plt.ylabel('$y$', fontsize=12) 
    plt.title(f'Grafik Fungsi: ${latex_expr}$', fontsize=14)
    plt.legend()
    plt.axhline(y=0, color='k', linewidth=0.5)
    plt.axvline(x=0, color='k', linewidth=0.5)
    
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png', dpi=150, bbox_inches='tight')
    img_buffer.seek(0)
    plt.close()
    
    return img_buffer