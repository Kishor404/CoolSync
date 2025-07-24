import os
import pickle
import pandas as pd
import requests
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Device
from .serializers import DeviceSerializer

# Load the ML model once at startup
model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'random_forest_model.pkl')
try:
    with open(model_path, 'rb') as model_file:
        model = pickle.load(model_file)
except FileNotFoundError:
    model = None
    print(f"Model file not found at {model_path}. Ensure the file exists.")

# Function to fetch shipment details using device_id
def fetch_shipment_data(device_id):
    url = 'http://127.0.0.1:8000/api/shipment/'  # Endpoint to fetch all shipments
    try:
        response = requests.get(url)
        response.raise_for_status()
        shipments = response.json()
        for shipment in shipments:
            if shipment.get('device_id') == str(device_id):
                return shipment
    except requests.RequestException as e:
        print(f"Error fetching shipment data: {e}")
    return None

# Function to fetch product data using product_id
def fetch_product_data(product_id):
    url = f'http://127.0.0.1:8000/api/products/{product_id}/'  # Endpoint to fetch product data
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching product data: {e}")
    return None

@api_view(['GET', 'POST'])
def devicess(request):
    if request.method == 'GET':
        devices = Device.objects.all()
        serializer = DeviceSerializer(devices, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = DeviceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE', 'PATCH'])
def devicess_item(request, id):
    try:
        device = Device.objects.get(id=id)
    except Device.DoesNotExist:
        return Response({'error': 'Device not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        device.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'GET':
        serializer = DeviceSerializer(device)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        data = request.data
        predicted_quality = None

        # Fetch the shipment associated with the device
        shipment = fetch_shipment_data(id)
        if shipment:
            product_id = shipment.get('product_id')
            product = fetch_product_data(product_id)

            if product:
                quantity = product.get('quantity', 0)

                # Prepare input data for the model
                input_data = pd.DataFrame({
                    "Temperature": [data.get('reading_temperature', 0)],
                    "Humidity": [data.get('reading_humidity', 0)],
                    "Ethylene Level": [data.get('ethylene_level', 0)],
                    "CO2 Level": [data.get('co2_level', 0)],
                    "Remaining Distance": [data.get('remaining_distance', 0)],
                })

                if model:
                    try:
                        # Predict quality using the ML model
                        standardized_data = model['scaler'].transform(input_data)
                        dmatrix = xgb.DMatrix(standardized_data)
                        predicted_quality = model['model'].predict(dmatrix)[0]
                        data['quality'] = int(predicted_quality)
                    except Exception as e:
                        print(f"Error during prediction: {e}")

        # Update the device object
        serializer = DeviceSerializer(device, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()

            # Update the product with the predicted quality if applicable
            if product and predicted_quality is not None:
                product['quality'] = int(predicted_quality)
                product_patch_url = f'http://127.0.0.1:8000/api/products/{product_id}/'
                try:
                    patch_response = requests.patch(product_patch_url, json=product)
                    patch_response.raise_for_status()
                except requests.RequestException as e:
                    print(f"Error updating product quality: {e}")
                    return Response({'error': 'Failed to update product quality'}, status=status.HTTP_400_BAD_REQUEST)

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
