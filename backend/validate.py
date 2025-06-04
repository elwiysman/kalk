def validate_input(operation, expression, variables, equations, params):
    """Validate input parameters before processing."""
    if not operation: 
        raise ValueError("Operation is required") 
    
    if operation not in [ 
        'aritmatika', 'simplify', 'expand', 'factor', 'faktorisasi',
        'turunan', 'integral', 'integral_tentu', 'persamaan',
        'substitutisi', 'logarithm', 'pecahan', 'statistika',
        'deret_aritmatika', 'deret_geometri', 'limit',
        'trigonometri', 'fungsi'
    ]:
        raise ValueError(f"Unknown operation: {operation}") 
    
    if not expression and not equations and operation != 'statistics': 
        raise ValueError("Expression or equations are required") 
    
    if operation == 'integral_tentu': 
        if 'lower_bound' not in params or 'upper_bound' not in params: 
            raise ValueError("Lower and upper bounds are required for definite integral") 
    
    if operation == 'substitutisi': 
        if 'old_var' not in params or 'new_expr' not in params: 
            raise ValueError("Old variable and new expression are required for substitution") 
    
    return True