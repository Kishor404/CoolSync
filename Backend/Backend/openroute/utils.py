import requests
from django.conf import settings

def fetch_route_from_openroute(coordinates, profile="driving-car", preference="fastest"):
    """
    Fetch the optimal route using OpenRouteService.

    Args:
        coordinates (list): List of coordinates [[lon1, lat1], [lon2, lat2], ...].
        profile (str): Mode of transportation (default: "driving-car").
        preference (str): Routing preference (default: "fastest").

    Returns:
        dict: The API response or error message.
    """
    api_url = f"https://api.openrouteservice.org/v2/directions/{profile}"
    headers = {
        "Authorization": settings.OPENROUTE_API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "coordinates": coordinates,
        "format": "geojson",
        "preference": preference,
    }

    try:
        response = requests.post(api_url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": str(e)}
    

