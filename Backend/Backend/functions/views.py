import os
import pickle
import pandas as pd
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from user.models import User
from user.serializers import UserSerializer
from device.models import Device
from device.serializers import DeviceSerializer
from product.models import Product
from product.serializers import ProductSerializer

# Get the base directory of the project to avoid relative path issues
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load the saved models and label encoders using absolute file paths
linear_demand_model_path = os.path.join(BASE_DIR, '/SIH24-Backend/Backend/functions/linear_demand_model.pkl')
linear_profit_model_path = os.path.join(BASE_DIR, '/SIH24-Backend/Backend/functions/linear_profit_model.pkl')
label_encoder_state_path = os.path.join(BASE_DIR, '/SIH24-Backend/Backend/functions/label_encoder_state.pkl')
label_encoder_month_path = os.path.join(BASE_DIR, '/SIH24-Backend/Backend/functions/label_encoder_month.pkl')

with open(linear_demand_model_path, 'rb') as f:
    linear_demand_model = pickle.load(f)

with open(linear_profit_model_path, 'rb') as f:
    linear_profit_model = pickle.load(f)

with open(label_encoder_state_path, 'rb') as f:
    label_encoder_state = pickle.load(f)

with open(label_encoder_month_path, 'rb') as f:
    label_encoder_month = pickle.load(f)

# ============== TRACK ME ============

@api_view(['POST'])
def track_me(request):
    user_id = request.data.get('user_id')
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "user_id not found"}, status=status.HTTP_404_NOT_FOUND)
    
    device_id = request.data.get('device_id')
    try:
        device = Device.objects.get(id=device_id)
        device_serializer = DeviceSerializer(device, data=request.data, partial=True)
        if device_serializer.is_valid():
            device_serializer.save()
        if int(device_serializer.data["product_id"]) > 0:
            product = Product.objects.get(id=device_serializer.data["product_id"])
            product_serializer = ProductSerializer(product, data=request.data, partial=True)
            if product_serializer.is_valid():
                product_serializer.save()
            connected_product = product_serializer.data
        else:
            connected_product = "Not Connected"

        if user.role == 'customer':
            user_serializer = UserSerializer(user, data={"role": "seller"}, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
                return Response({"Device": device_serializer.data, "Product": connected_product}, status=status.HTTP_200_OK)
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        else:
            return Response({"message": "Already A Seller"}, status=status.HTTP_200_OK)
        
    except Device.DoesNotExist:
        return Response({"error": "device_id not found"}, status=status.HTTP_404_NOT_FOUND)

# =============== DEMAND FORECASTING ===============

@api_view(['GET'])
def predict_demand_and_profit(request):
    state_input = request.GET.get('state')
    month_input = request.GET.get('month')

    if not state_input or not month_input:
        return Response({'error': 'State and month are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Encode the input state and month
        state_encoded = label_encoder_state.transform([state_input])[0]
        month_encoded = label_encoder_month.transform([int(month_input)])[0]

        # Prepare input data for prediction
        input_data = pd.DataFrame([[state_encoded, month_encoded]], columns=['State', 'Month'])

        # Make predictions
        predicted_demand = linear_demand_model.predict(input_data)[0]
        predicted_profit = linear_profit_model.predict(input_data)[0]

        # Round off the predictions
        rounded_demand = round(predicted_demand, 2)
        rounded_profit = round(predicted_profit, 2)

        # Return the results in JSON response
        return Response({
            'predicted_demand': rounded_demand,
            'predicted_profit': rounded_profit
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
