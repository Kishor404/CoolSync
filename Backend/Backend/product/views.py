# views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer

@api_view(['GET', 'POST'])
def product(request):
    if request.method == 'GET':
        # Handle GET request: return all products
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # Handle POST request: create a new product
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Created successfully
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Bad request if validation fails

@api_view(['GET','DELETE', 'PATCH'])
def product_item(request, id):
    try:
        product = Product.objects.get(id=id)  # Retrieve product by ID
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        # Handle DELETE request: delete a product by ID
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method=='GET':
        try:
            products = Product.objects.get(id=id) 
            serializer = ProductSerializer(products) 
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)  # No content to return after deletion

    elif request.method == 'PATCH':
        # Handle PATCH request: partially update a product by ID
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
