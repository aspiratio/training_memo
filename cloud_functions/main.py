def my_function(request):
    params = request.args
    if "name" in params:
        return f"Hello, {params['name']}!"
    else:
        return "Hello, World!"
