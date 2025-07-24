from django.shortcuts import render

# Create your views here.
# views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Driver
from .serializers import DriverSerializer

@api_view(['GET', 'POST'])
def driverr(request):
    if request.method == 'GET':
        # Handle GET request: return all drivers
        drivers = Driver.objects.all()
        serializer = DriverSerializer(drivers, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # Handle POST request: create a new driver
        serializer = DriverSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Created successfully
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Bad request if validation fails

@api_view(['GET','DELETE', 'PATCH'])
def driverr_item(request, id):
    try:
        driver = Driver.objects.get(id=id)  # Retrieve driver by ID
    except Driver.DoesNotExist:
        return Response({'error': 'driver not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        # Handle DELETE request: delete a driver by ID
        driver.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)  # No content to return after deletion
    
    elif request.method=='GET':
        try:
            driver = Driver.objects.get(id=id) 
            serializer = DriverSerializer(driver) 
            return Response(serializer.data)  
        except Driver.DoesNotExist:
            return Response({'error': 'Driver not found'}, status=404) 

    elif request.method == 'PATCH':
        # Handle PATCH request: partially update a driver by ID
        serializer = DriverSerializer(driver, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
