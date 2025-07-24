# views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Bid
from .serializers import BidSerializer

@api_view(['GET', 'POST'])
def Bidd(request):
    if request.method == 'GET':
        # Handle GET request: return all bids
        bids = Bid.objects.all()
        serializer = BidSerializer(bids, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # Handle POST request: create a new bid
        serializer = BidSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Created successfully
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Bad request if validation fails

@api_view(['DELETE', 'PATCH'])
def Bidd_item(request, id):
    try:
        bid = Bid.objects.get(id=id)  # Retrieve bid by ID
    except Bid.DoesNotExist:
        return Response({'error': 'Bid not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        # Handle DELETE request: delete a bid by ID
        bid.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)  # No content to return after deletion

    elif request.method == 'PATCH':
        # Handle PATCH request: partially update a bid by ID
        serializer = BidSerializer(bid, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
