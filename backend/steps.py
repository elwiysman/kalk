import sympy as sp

def create_latex_steps(operation, expression, variables, params, result, intermediate_steps=None):
    """Create detailed LaTeX steps for mathematical operations"""
    steps = [] 
    
    try:
        if operation == 'pecahan': 
            action = params.get("action", "simplify") 
            expr1 = params.get("expr1", "1/2") 
            expr2 = params.get("expr2", "1/3") 
            
            frac1 = sp.Rational(expr1) 
            frac2 = sp.Rational(expr2) if expr2 else None 
            
            steps.append({ 
                'description': 'Operasi Pecahan',
                'latex': f'\\text{{Operasi: }} {action.replace("_", " ").title()}'
            })
            
            if action == "simplify": 
                steps.append({ 
                    'description': 'Pecahan Asli',
                    'latex': f'{sp.latex(frac1)}'
                })
                steps.append({ 
                    'description': 'Cari FPB pembilang dan penyebut',
                    'latex': f'\\text{{FPB dari }} {frac1.numerator} \\text{{ dan }} {frac1.denominator} = {sp.gcd(frac1.numerator, frac1.denominator)}'
                })
                steps.append({ 
                    'description': 'Sederhanakan pecahan dengan membagi pembilang dan penyebut dengan FPB',
                    'latex': f'\\frac{{{frac1.numerator} \\div {sp.gcd(frac1.numerator, frac1.denominator)}}}{{{frac1.denominator} \\div {sp.gcd(frac1.numerator, frac1.denominator)}}} = \\boxed{{{sp.latex(result)}}}'
                })
            elif action in ["add", "subtract"]: 
                operator = "+" if action == "add" else "-" 
                steps.append({ 
                    'description': 'Pecahan Asli',
                    'latex': f'{sp.latex(frac1)} {operator} {sp.latex(frac2)}'
                })
                
                denom1 = frac1.denominator 
                denom2 = frac2.denominator 
                lcm = sp.lcm(denom1, denom2) 
                
                steps.append({ 
                    'description': 'Cari penyebut umum (KPK)',
                    'latex': f'\\text{{KPK dari }} {denom1} \\text{{ dan }} {denom2} = {lcm}'
                })
                
                steps.append({ 
                    'description': 'Ubah pecahan ke penyebut umum',
                    'latex': f'\\frac{{{frac1.numerator} \\times {lcm // denom1}}}{{{lcm}}} {operator} \\frac{{{frac2.numerator} \\times {lcm // denom2}}}{{{lcm}}}'
                })
                
                steps.append({ 
                    'description': 'Lakukan operasi pada pembilang',
                    'latex': f'\\frac{{{frac1.numerator * (lcm // denom1)} {operator} {frac2.numerator * (lcm // denom2)}}}{{{lcm}}}'
                })
                
                combined_num = frac1.numerator * (lcm // denom1) + (frac2.numerator * (lcm // denom2) if action == "add" else -frac2.numerator * (lcm // denom2)) 
                steps.append({ 
                    'description': 'Gabungkan pembilang',
                    'latex': f'\\frac{{{combined_num}}}{{{lcm}}}'
                })
                
                if sp.gcd(combined_num, lcm) != 1: 
                    steps.append({ 
                        'description': 'Sederhanakan hasilnya',
                        'latex': f'\\frac{{{combined_num} \\div {sp.gcd(combined_num, lcm)}}}{{{lcm} \\div {sp.gcd(combined_num, lcm)}}} = \\boxed{{{sp.latex(result)}}}'
                    })
                else:
                    steps.append({ 
                        'description': 'Hasil akhir (sudah disederhanakan)',
                        'latex': f'\\boxed{{{sp.latex(result)}}}'
                    })
            elif action in ["multiply", "divide"]: 
                operator = "\\times" if action == "multiply" else "\\div" 
                steps.append({ 
                    'description': 'Pecahan Asli',
                    'latex': f'{sp.latex(frac1)} {operator} {sp.latex(frac2)}'
                })
                
                if action == "multiply": 
                    steps.append({ 
                        'description': 'Kalikan pembilang dan penyebut',
                        'latex': f'\\frac{{{frac1.numerator} \\times {frac2.numerator}}}{{{frac1.denominator} \\times {frac2.denominator}}} = \\frac{{{frac1.numerator * frac2.numerator}}}{{{frac1.denominator * frac2.denominator}}}'
                    })
                else:
                    steps.append({ 
                        'description': 'Balikkan pecahan kedua dan ubah menjadi perkalian',
                        'latex': f'{sp.latex(frac1)} \\times \\frac{{{frac2.denominator}}}{{{frac2.numerator}}}'
                    })
                    steps.append({ 
                        'description': 'Sekarang kalikan pembilang dan penyebut',
                        'latex': f'\\frac{{{frac1.numerator} \\times {frac2.denominator}}}{{{frac1.denominator} \\times {frac2.numerator}}}'
                    })
                
                if sp.gcd(result.numerator, result.denominator) != 1: 
                    steps.append({ 
                        'description': 'Sederhanakan hasilnya',
                        'latex': f'\\frac{{{result.numerator} \\div {sp.gcd(result.numerator, result.denominator)}}}{{{result.denominator} \\div {sp.gcd(result.numerator, result.denominator)}}} = \\boxed{{{sp.latex(result)}}}'
                    })
                else:
                    steps.append({ 
                        'description': 'Hasil akhir (sudah disederhanakan)',
                        'latex': f'\\boxed{{{sp.latex(result)}}}'
                    })
            elif action == "compare": 
                steps.append({ 
                    'description': 'Bandingkan pecahan',
                    'latex': f'{sp.latex(frac1)} \\text{{ dan }} {sp.latex(frac2)}'
                })
                steps.append({ 
                    'description': 'Cari penyebut umum untuk perbandingan',
                    'latex': f'\\frac{{{frac1.numerator} \\times {frac2.denominator}}}{{{frac1.denominator} \\times {frac2.denominator}}} = \\frac{{{frac1.numerator * frac2.denominator}}}{{{frac1.denominator * frac2.denominator}}}'
                })
                steps.append({ 
                    'description': '',
                    'latex': f'\\frac{{{frac2.numerator} \\times {frac1.denominator}}}{{{frac2.denominator} \\times {frac1.denominator}}} = \\frac{{{frac2.numerator * frac1.denominator}}}{{{frac2.denominator * frac1.denominator}}}'
                })
                steps.append({ 
                    'description': 'Bandingkan pembilang',
                    'latex': f'{frac1.numerator * frac2.denominator} \\text{{ vs }} {frac2.numerator * frac1.denominator}'
                })
                steps.append({ 
                    'description': 'Hasil perbandingan',
                    'latex': f'\\boxed{{{result}}}'
                })
            elif action == "convert": 
                steps.append({ 
                    'description': 'Ubah pecahan ke desimal',
                    'latex': f'{sp.latex(frac1)} = {frac1.numerator} \\div {frac1.denominator}'
                })
                steps.append({ 
                    'description': 'Hasil pembagian',
                    'latex': f'= {float(frac1)}'
                })

        elif operation == 'aritmatika': 
            expr = sp.sympify(expression) 
            steps.append({ 
                'description': 'Evaluasi Ekspresi Aritmatika',
                'latex': f'\\text{{Diberikan: }} {sp.latex(expr)}'
            })
            
            if expr.is_Add: 
                terms = expr.args 
                current_sum = terms[0] 
                steps.append({ 
                    'description': 'Mulai dengan suku pertama',
                    'latex': f'= {sp.latex(current_sum)}'
                })
                for term in terms[1:]: 
                    steps.append({ 
                        'description': f'Tambahkan suku berikutnya: {sp.latex(term)}',
                        'latex': f'= {sp.latex(current_sum)} + {sp.latex(term)} = {sp.latex(current_sum + term)}'
                    })
                    current_sum += term 
            elif expr.is_Mul: 
                factors = expr.args 
                current_prod = factors[0] 
                steps.append({ 
                    'description': 'Mulai dengan faktor pertama',
                    'latex': f'= {sp.latex(current_prod)}'
                })
                for factor in factors[1:]: 
                    steps.append({ 
                        'description': f'Kalikan dengan faktor berikutnya: {sp.latex(factor)}',
                        'latex': f'= {sp.latex(current_prod)} \\times {sp.latex(factor)} = {sp.latex(current_prod * factor)}'
                    })
                    current_prod *= factor 
            elif expr.is_Pow: 
                base, exponent = expr.args 
                steps.append({ 
                    'description': 'Hitung pangkat',
                    'latex': f'= {sp.latex(base)}^{{{sp.latex(exponent)}}}'
                })
                if exponent.is_Integer: 
                    if exponent > 0: 
                        steps.append({ 
                            'description': f'Kalikan {base} dengan dirinya sendiri {exponent-1} kali',
                            'latex': f'= {sp.latex(base)}' + f' \\times {sp.latex(base)}'*(exponent-1)
                        })
                    elif exponent < 0: 
                        steps.append({ 
                            'description': 'Pangkat negatif berarti kebalikan',
                            'latex': f'= \\frac{{1}}{{{sp.latex(base)}^{{{-exponent}}}}}'
                        })
            
            steps.append({ 
                'description': 'Hasil akhir',
                'latex': f'\\boxed{{{sp.latex(result)}}}'
            })

        elif operation == 'turunan': 
            var = sp.Symbol(variables[0]) 
            expr = sp.sympify(expression) 
            steps.append({ 
                'description': 'Hitung Turunan',
                'latex': f'\\text{{Diberikan: }} f({variables[0]}) = {sp.latex(expr)}'
            })
            steps.append({ 
                'description': 'Diferensiasikan terhadap variabel',
                'latex': f'\\frac{{d}}{{d{variables[0]}}}\\left[{sp.latex(expr)}\\right]'
            })
            
            if expr.is_Add: 
                sum_latex = ' + '.join( 
                    [f'\\frac{{d}}{{d{variables[0]}}}[{sp.latex(arg)}]' for arg in expr.args] 
                )
                steps.append({ 
                    'description': 'Terapkan aturan penjumlahan: turunan dari sebuah penjumlahan adalah penjumlahan dari turunan',
                    'latex': f'= {sum_latex}'
                })

                
                for term in expr.args: 
                    term_deriv = sp.diff(term, var) 
                    steps.append({ 
                        'description': f'Diferensiasikan suku: {sp.latex(term)}',
                        'latex': f'\\frac{{d}}{{d{variables[0]}}}[{sp.latex(term)}] = {sp.latex(term_deriv)}'
                    })
            elif expr.is_Mul: 
                u, v = expr.args[0], sp.Mul(*expr.args[1:]) 
                steps.append({ 
                    'description': 'Terapkan aturan perkalian: (uv)\' = u\'v + uv\'',
                    'latex': f'= \\frac{{d}}{{d{variables[0]}}}[{sp.latex(u)}] \\cdot {sp.latex(v)} + {sp.latex(u)} \\cdot \\frac{{d}}{{d{variables[0]}}}[{sp.latex(v)}]'
                })
                u_deriv = sp.diff(u, var) 
                v_deriv = sp.diff(v, var) 
                steps.append({ 
                    'description': 'Hitung turunan dari setiap bagian',
                    'latex': f'= {sp.latex(u_deriv)} \\cdot {sp.latex(v)} + {sp.latex(u)} \\cdot {sp.latex(v_deriv)}'
                })
                steps.append({ 
                    'description': 'Perluas dan sederhanakan',
                    'latex': f'= {sp.latex(u_deriv * v + u * v_deriv)}'
                })
            elif expr.is_Pow: 
                base, exponent = expr.args 
                if base == var: 
                    steps.append({ 
                        'description': 'Terapkan aturan pangkat: d/dx[x^n] = n*x^(n-1)',
                        'latex': f'= {sp.latex(exponent)} \\cdot {variables[0]}^{{{sp.latex(exponent-1)}}}'
                    })
                else:
                    steps.append({ 
                        'description': 'Terapkan aturan rantai untuk pangkat umum: d/dx[u^n] = n*u^(n-1)*u\'',
                        'latex': f'= {sp.latex(exponent)} \\cdot {sp.latex(base)}^{{{sp.latex(exponent-1)}}} \\cdot \\frac{{d}}{{d{variables[0]}}}[{sp.latex(base)}]'
                    })
                    base_deriv = sp.diff(base, var) 
                    steps.append({ 
                        'description': 'Hitung turunan dari basis',
                        'latex': f'= {sp.latex(exponent)} \\cdot {sp.latex(base)}^{{{sp.latex(exponent-1)}}} \\cdot {sp.latex(base_deriv)}'
                    })
            elif expr.has(sp.sin): 
                arg = expr.args[0] 
                steps.append({ 
                    'description': 'Terapkan turunan sinus: d/dx[sin(u)] = cos(u)*u\'',
                    'latex': f'= \\cos({sp.latex(arg)}) \\cdot \\frac{{d}}{{d{variables[0]}}}[{sp.latex(arg)}]'
                })
                arg_deriv = sp.diff(arg, var) 
                steps.append({ 
                    'description': 'Hitung turunan dari argumen',
                    'latex': f'= \\cos({sp.latex(arg)}) \\cdot {sp.latex(arg_deriv)}'
                })
            elif expr.has(sp.cos): 
                arg = expr.args[0] 
                steps.append({ 
                    'description': 'Terapkan turunan kosinus: d/dx[cos(u)] = -sin(u)*u\'',
                    'latex': f'= -\\sin({sp.latex(arg)}) \\cdot \\frac{{d}}{{d{variables[0]}}}[{sp.latex(arg)}]'
                })
                arg_deriv = sp.diff(arg, var) 
                steps.append({ 
                    'description': 'Hitung turunan dari argumen',
                    'latex': f'= -\\sin({sp.latex(arg)}) \\cdot {sp.latex(arg_deriv)}'
                })
            elif expr.has(sp.exp): 
                arg = expr.args[0] 
                steps.append({ 
                    'description': 'Terapkan turunan eksponensial: d/dx[e^u] = e^u*u\'',
                    'latex': f'= e^{{{sp.latex(arg)}}} \\cdot \\frac{{d}}{{d{variables[0]}}}[{sp.latex(arg)}]'
                })
                arg_deriv = sp.diff(arg, var) 
                steps.append({ 
                    'description': 'Hitung turunan dari eksponen',
                    'latex': f'= e^{{{sp.latex(arg)}}} \\cdot {sp.latex(arg_deriv)}'
                })
            
            steps.append({ 
                'description': 'Turunan akhir',
                'latex': f'f\'({variables[0]}) = \\boxed{{{sp.latex(result)}}}'
            })

        elif operation == 'integral': 
            var = sp.Symbol(variables[0]) 
            expr = sp.sympify(expression) 
            steps.append({ 
                'description': 'Hitung Integral Tak Tentu',
                'latex': f'\\text{{Diberikan: }} \\int {sp.latex(expr)} \\, d{variables[0]}'
            })
            
            if expr.is_Add: 
                steps.append({ 
                    'description': 'Terapkan aturan penjumlahan: integral dari penjumlahan adalah penjumlahan dari integral',
                    'latex': f'= \\int {sp.latex(expr.args[0])} \\, d{variables[0]} + \\int {sp.latex(expr.args[1])} \\, d{variables[0]} + \\cdots'
                })
                for term in expr.args: 
                    term_integral = sp.integrate(term, var) 
                    steps.append({ 
                        'description': f'Integralkan suku: {sp.latex(term)}',
                        'latex': f'\\int {sp.latex(term)} \\, d{variables[0]} = {sp.latex(term_integral)} + C'
                    })
            elif expr.is_Pow and expr.args[0] == var: 
                n = expr.args[1] 
                if n != -1: 
                    steps.append({ 
                        'description': f'Terapkan aturan pangkat: ∫x^n dx = x^(n+1)/(n+1) + C (untuk n ≠ -1)',
                        'latex': f'= \\frac{{{variables[0]}^{{{sp.latex(n+1)}}}}}{{{sp.latex(n+1)}}} + C'
                    })
                else:
                    steps.append({ 
                        'description': 'Kasus khusus untuk n = -1',
                        'latex': f'= \\ln|{variables[0]}| + C'
                    })
            elif expr.is_Pow: 
                base, exponent = expr.args 
                if exponent == -1: 
                    steps.append({ 
                        'description': 'Integral dari resiprokal',
                        'latex': f'= \\ln|{sp.latex(base)}| \\cdot \\frac{{1}}{{\\frac{{d}}{{d{variables[0]}}}[{sp.latex(base)}]}} + C'
                    })
            elif expr.has(sp.sin): 
                arg = expr.args[0] 
                if arg == var: 
                    steps.append({ 
                        'description': 'Integral langsung dari sinus',
                        'latex': f'= -\\cos({variables[0]}) + C'
                    })
                else:
                    steps.append({ 
                        'description': 'Terapkan aturan substitusi untuk sinus',
                        'latex': f'= -\\frac{{\\cos({sp.latex(arg)})}}{{\\frac{{d}}{{d{variables[0]}}}[{sp.latex(arg)}]}} + C'
                    })
            elif expr.has(sp.cos): 
                arg = expr.args[0] 
                if arg == var: 
                    steps.append({ 
                        'description': 'Integral langsung dari kosinus',
                        'latex': f'= \\sin({variables[0]}) + C'
                    })
                else:
                    steps.append({ 
                        'description': 'Terapkan aturan substitusi untuk kosinus',
                        'latex': f'= \\frac{{\\sin({sp.latex(arg)})}}{{\\frac{{d}}{{d{variables[0]}}}[{sp.latex(arg)}]}} + C'
                    })
            elif expr.has(sp.exp): 
                arg = expr.args[0] 
                if arg == var: 
                    steps.append({ 
                        'description': 'Integral langsung dari eksponensial',
                        'latex': f'= e^{{{variables[0]}}} + C'
                    })
                else:
                    steps.append({ 
                        'description': 'Terapkan aturan substitusi untuk eksponensial',
                        'latex': f'= \\frac{{e^{{{sp.latex(arg)}}}}}{{\\frac{{d}}{{d{variables[0]}}}[{sp.latex(arg)}]}} + C'
                    })
            
            steps.append({ 
                'description': 'Integral akhir',
                'latex': f'\\int {sp.latex(expr)} \\, d{variables[0]} = \\boxed{{{sp.latex(result)} + C}}'
            })

        elif operation == 'integral_tentu': 
            var = sp.Symbol(variables[0]) 
            expr = sp.sympify(expression) 
            a = sp.sympify(params.get("lower_bound", 0)) 
            b = sp.sympify(params.get("upper_bound", 1)) 
            
            steps.append({ 
                'description': 'Hitung Integral Tentu',
                'latex': f'\\text{{Diberikan: }} \\int_{{{sp.latex(a)}}}^{{{sp.latex(b)}}} {sp.latex(expr)} \\, d{variables[0]}'
            })
            
            antiderivative = sp.integrate(expr, var) 
            steps.append({ 
                'description': 'Langkah 1: Cari antiturunan (integral tak tentu)',
                'latex': f'F({variables[0]}) = \\int {sp.latex(expr)} \\, d{variables[0]} = {sp.latex(antiderivative)} + C'
            })
            
            steps.append({ 
                'description': 'Langkah 2: Terapkan Teorema Dasar Kalkulus',
                'latex': f'= F({sp.latex(b)}) - F({sp.latex(a)})'
            })
            
            upper_val = antiderivative.subs(var, b) 
            lower_val = antiderivative.subs(var, a) 
            
            steps.append({ 
                'description': 'Langkah 3: Evaluasi pada batas atas',
                'latex': f'F({sp.latex(b)}) = {sp.latex(antiderivative.subs(var, b))} = {sp.latex(upper_val)}'
            })
            
            steps.append({ 
                'description': 'Langkah 4: Evaluasi pada batas bawah',
                'latex': f'F({sp.latex(a)}) = {sp.latex(antiderivative.subs(var, a))} = {sp.latex(lower_val)}'
            })
            
            steps.append({ 
                'description': 'Langkah 5: Kurangkan batas bawah dari batas atas',
                'latex': f'= {sp.latex(upper_val)} - ({sp.latex(lower_val)})'
            })
            
            steps.append({ 
                'description': 'Hasil akhir',
                'latex': f'= \\boxed{{{sp.latex(result)}}}'
            })

        elif operation == 'persamaan': 
            if isinstance(result, list): 
                eq_expr = sp.sympify(expression.split('=')[0]) - sp.sympify(expression.split('=')[1]) if '=' in expression else sp.sympify(expression) 
                steps.append({ 
                    'description': 'Selesaikan Persamaan',
                    'latex': f'\\text{{Diberikan: }} {expression.replace("=", " = ")}'
                })
                
                steps.append({ 
                    'description': 'Tulis ulang persamaan dalam bentuk standar',
                    'latex': f'{sp.latex(eq_expr)} = 0'
                })
                
                if eq_expr.is_Add: 
                    const_term = 0 
                    var_term = eq_expr 
                    for term in eq_expr.args: 
                        if term.is_constant(): 
                            const_term += term 
                            var_term -= term 
                    steps.append({ 
                        'description': 'Pindahkan suku konstanta ke sisi lain',
                        'latex': f'{sp.latex(var_term)} = {sp.latex(-const_term)}'
                    })
                    if var_term.is_Mul: 
                        coeff = var_term.args[0] 
                        var_part = var_term.args[1] 
                        steps.append({ 
                            'description': 'Bagi kedua sisi dengan koefisien',
                            'latex': f'{sp.latex(var_part)} = \\frac{{{sp.latex(-const_term)}}}{{{sp.latex(coeff)}}}'
                        })
                        steps.append({ 
                            'description': 'Sederhanakan',
                            'latex': f'{variables[0]} = {sp.latex(result[0])}'
                        })
                
                if len(result) == 1: 
                    steps.append({ 
                        'description': 'Satu solusi ditemukan',
                        'latex': f'{variables[0]} = \\boxed{{{sp.latex(result[0])}}}'
                    })
                else:
                    solutions = ', '.join([f'{variables[0]} = {sp.latex(sol)}' for sol in result]) 
                    steps.append({ 
                        'description': f'Ditemukan {len(result)} solusi',
                        'latex': f'\\boxed{{{solutions}}}'
                    })

        elif operation == 'faktorisasi' or operation == 'factor': 
            expr = sp.sympify(expression) 
            steps.append({ 
                'description': 'Faktorkan Ekspresi',
                'latex': f'\\text{{Diberikan: }} {sp.latex(expr)}'
            })
            
            if expr.is_Add: 
                common_factor = sp.gcd_terms(expr) 
                if common_factor != 1: 
                    steps.append({ 
                        'description': 'Cari faktor persekutuan terbesar',
                        'latex': f'\\text{{FPB: }} {sp.latex(common_factor)}'
                    })
                    factored = sp.factor(expr) 
                    steps.append({ 
                        'description': 'Faktorkan FPB',
                        'latex': f'= {sp.latex(common_factor)} \\cdot \\left({sp.latex(factored/common_factor)}\\right)'
                    })
            elif expr.is_Pow: 
                base, exp = expr.args 
                if base.is_Add and exp == 2: 
                    steps.append({ 
                        'description': 'Kenali kuadrat sempurna',
                        'latex': f'= ({sp.latex(sp.sqrt(base))})^2'
                    })
            
            steps.append({ 
                'description': 'Bentuk faktor akhir',
                'latex': f'{sp.latex(expr)} = \\boxed{{{sp.latex(result)}}}'
            })

        elif operation == 'limit': 
            var = sp.Symbol(variables[0]) 
            expr = sp.sympify(expression) 
            point = params.get("point", 0) 
            
            steps.append({ 
                'description': 'Hitung Limit',
                'latex': f'\\lim_{{{variables[0]} \\to {sp.latex(sp.sympify(point))}}} {sp.latex(expr)}'
            })
            
            try:
                direct_sub = expr.subs(var, point) 
                if direct_sub.is_finite: 
                    steps.append({ 
                        'description': 'Substitusi langsung',
                        'latex': f'= {sp.latex(direct_sub)}'
                    })
                else:
                    steps.append({ 
                        'description': 'Substitusi langsung menghasilkan bentuk tak tentu',
                        'latex': f'\\text{{Mensubstitusikan }} {variables[0]} = {point} \\text{{ menghasilkan }} {sp.latex(direct_sub)}'
                    })
                    if sp.limit(expr, var, point, dir='-') == sp.limit(expr, var, point, dir='+'): 
                        steps.append({ 
                            'description': 'Limit kiri dan kanan sama',
                            'latex': f'\\lim_{{{variables[0]} \\to {point}^-}} = \\lim_{{{variables[0]} \\to {point}^+}} = {sp.latex(result)}'
                        })
                    else:
                        steps.append({ 
                            'description': 'Limit kiri dan kanan berbeda',
                            'latex': f'\\text{{Limit tidak ada (limit kiri ≠ limit kanan)}}'
                        })
            except:
                steps.append({ 
                    'description': 'Mengevaluasi limit memerlukan teknik khusus',
                    'latex': f'\\text{{Menggunakan properti limit dan manipulasi aljabar}}'
                })
            
            steps.append({ 
                'description': 'Nilai limit akhir',
                'latex': f'\\lim_{{{variables[0]} \\to {sp.latex(sp.sympify(point))}}} {sp.latex(expr)} = \\boxed{{{sp.latex(result)}}}'
            })

        elif operation == 'deret_aritmatika': 
            first_term = params.get("first_term", 1) 
            common_diff = params.get("common_diff", 1) 
            n_term = params.get("n_term", 1) 
            seq_type = params.get("seq_type", "term") 
            
            steps.append({ 
                'description': 'Barisan Aritmatika',
                'latex': f'\\text{{Diberikan: }} a_1 = {first_term}, \\quad d = {common_diff}'
            })
            
            if seq_type == "term": 
                steps.append({ 
                    'description': 'Rumus suku ke-n barisan aritmatika',
                    'latex': f'a_n = a_1 + (n-1) \\cdot d'
                })
                steps.append({ 
                    'description': f'Substitusikan untuk mencari suku ke-{n_term}',
                    'latex': f'a_{{{n_term}}} = {first_term} + ({n_term}-1) \\cdot {common_diff}'
                })
                steps.append({ 
                    'description': 'Hitung',
                    'latex': f'= {first_term} + {n_term-1} \\times {common_diff}'
                })
                steps.append({ 
                    'description': 'Nilai suku akhir',
                    'latex': f'= \\boxed{{{result}}}'
                })
            else:
                steps.append({ 
                    'description': 'Rumus jumlah n suku pertama barisan aritmatika',
                    'latex': f'S_n = \\frac{{n}}{{2}}[2a_1 + (n-1)d]'
                })
                steps.append({ 
                    'description': f'Substitusikan untuk mencari jumlah {n_term} suku pertama',
                    'latex': f'S_{{{n_term}}} = \\frac{{{n_term}}}{{2}}[2 \\times {first_term} + ({n_term}-1) \\times {common_diff}]'
                })
                steps.append({ 
                    'description': 'Hitung suku di dalam kurung',
                    'latex': f'= \\frac{{{n_term}}}{{2}}[{2*first_term} + {(n_term-1)*common_diff}]'
                })
                steps.append({ 
                    'description': 'Kalikan',
                    'latex': f'= \\frac{{{n_term}}}{{2}} \\times {2*first_term + (n_term-1)*common_diff}'
                })
                steps.append({ 
                    'description': 'Jumlah akhir',
                    'latex': f'= \\boxed{{{result}}}'
                })

        elif operation == 'deret_geometri': 
            first_term = params.get("first_term", 1) 
            common_ratio = params.get("common_ratio", 2) 
            n_term = params.get("n_term", 1) 
            seq_type = params.get("seq_type", "term") 
            
            steps.append({ 
                'description': 'Barisan Geometri',
                'latex': f'\\text{{Diberikan: }} a_1 = {first_term}, \\quad r = {common_ratio}'
            })
            
            if seq_type == "term": 
                steps.append({ 
                    'description': 'Rumus suku ke-n barisan geometri',
                    'latex': f'a_n = a_1 \\cdot r^{{n-1}}'
                })
                steps.append({ 
                    'description': f'Substitusikan untuk mencari suku ke-{n_term}',
                    'latex': f'a_{{{n_term}}} = {first_term} \\times {common_ratio}^{{{n_term}-1}}'
                })
                steps.append({ 
                    'description': 'Hitung eksponen',
                    'latex': f'= {first_term} \\times {common_ratio**(n_term-1)}'
                })
                steps.append({ 
                    'description': 'Nilai suku akhir',
                    'latex': f'= \\boxed{{{result}}}'
                })
            else:
                if common_ratio != 1: 
                    steps.append({ 
                        'description': 'Rumus jumlah n suku pertama barisan geometri (r ≠ 1)',
                        'latex': f'S_n = a_1 \\cdot \\frac{{r^n - 1}}{{r - 1}}'
                    })
                    steps.append({ 
                        'description': f'Substitusikan untuk mencari jumlah {n_term} suku pertama',
                        'latex': f'S_{{{n_term}}} = {first_term} \\times \\frac{{{common_ratio}^{{{n_term}}} - 1}}{{{common_ratio} - 1}}'
                    })
                    steps.append({ 
                        'description': 'Hitung pembilang dan penyebut',
                        'latex': f'= {first_term} \\times \\frac{{{common_ratio**n_term} - 1}}{{{common_ratio - 1}}}'
                    })
                    steps.append({ 
                        'description': 'Jumlah akhir',
                        'latex': f'= \\boxed{{{result}}}'
                    })
                else:
                    steps.append({ 
                        'description': 'Kasus khusus ketika rasio umum adalah 1',
                        'latex': f'S_n = n \\times a_1'
                    })
                    steps.append({ 
                        'description': 'Hitung jumlah',
                        'latex': f'S_{{{n_term}}} = {n_term} \\times {first_term}'
                    })
                    steps.append({ 
                        'description': 'Jumlah akhir',
                        'latex': f'= \\boxed{{{result}}}'
                    })

        else:
            expr = sp.sympify(expression) if expression else None 
            if expr: 
                steps.append({ 
                    'description': f'Operasi: {operation.title()}',
                    'latex': f'\\text{{Masukan: }} {sp.latex(expr)}'
                })
                if operation == 'simplify': 
                    steps.append({ 
                        'description': 'Terapkan aturan penyederhanaan',
                        'latex': f'\\text{{Bentuk sederhana: }} {sp.latex(result)}'
                    })
                elif operation == 'expand': 
                    steps.append({ 
                        'description': 'Terapkan aturan perluasan',
                        'latex': f'\\text{{Bentuk diperluas: }} {sp.latex(result)}'
                    })
                steps.append({ 
                    'description': 'Hasil akhir',
                    'latex': f'\\boxed{{{sp.latex(result)}}}'
                })

    except Exception as e:
        steps = [{ 
            'description': 'Terjadi kesalahan dalam menghasilkan langkah-langkah LaTeX',
            'latex': f'\\text{{Hasil: }} {str(result)}'
        }]
    
    return steps