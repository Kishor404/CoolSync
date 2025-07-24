from django.http import JsonResponse
from .utils import predict_quality
from rest_framework.decorators import api_view

# Temp, Humi, Etheleyen, CO2, Light, Time, Distance

@api_view(['POST'])
def predict_view(request):
    if request.method == "POST":
        # Parse JSON input from the body
        try:
            input_data = request.data.get("input_data")  # Assuming input is sent as a JSON field
            
            if input_data is None:
                return JsonResponse({"error": "input_data is missing from the request."}, status=400)
            
            # Convert the string to a list of floats
            input_data = list(map(float, input_data.split(",")))
            
            # Make a prediction
            prediction = predict_quality(input_data)
            
            # Return prediction as JSON
            return JsonResponse({"quality_score": prediction})
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=400)
