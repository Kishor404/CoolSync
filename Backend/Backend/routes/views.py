from django.shortcuts import render

# Create your views here.
# views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Routes
from .serializers import RoutesSerializer

@api_view(['GET', 'POST'])
def routess(request):
    if request.method == 'GET':
        # Handle GET request: return all routes
        routes = Routes.objects.all()
        serializer = RoutesSerializer(routes, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # Handle POST request: create a new Routes
        serializer = RoutesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Created successfully
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Bad request if validation fails

@api_view(['GET','DELETE', 'PATCH'])
def routess_item(request, id):
    try:
        route = Routes.objects.get(id=id)  # Retrieve Routes by ID
    except Routes.DoesNotExist:
        return Response({'error': 'route not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        # Handle DELETE request: delete a route by ID
        route.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    elif request.method=='GET':
        try:
            routes = Routes.objects.get(id=id) 
            serializer = RoutesSerializer(routes) 
            return Response(serializer.data)  
        except Routes.DoesNotExist:
            return Response({'error': 'Routes not found'}, status=404)   # No content to return after deletion

    elif request.method == 'PATCH':
        # Handle PATCH request: partially update a route by ID
        serializer = RoutesSerializer(route, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
