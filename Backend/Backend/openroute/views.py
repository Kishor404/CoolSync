from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .utils import fetch_route_from_openroute

@csrf_exempt
def get_route(request):
    """
    Django view to get an optimal route.
    Accepts POST requests with JSON data containing "coordinates".

    Example request body:
    {
        "coordinates": [[8.681495, 49.41461], [8.687872, 49.420318]]
    }
    """
    if request.method == "POST":
        import json
        try:
            data = json.loads(request.body)
            coordinates = data.get("coordinates")
            if not coordinates or not isinstance(coordinates, list):
                return JsonResponse({"error": "Invalid coordinates format"}, status=400)

            # Call utility function to fetch the route
            route_data = fetch_route_from_openroute(coordinates)
            return JsonResponse(route_data)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
    return JsonResponse({"error": "Only POST requests are allowed"}, status=405)
