from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Shipment
from .serializers import ShipmentSerializer
import threading
import time
import requests

def change_shipment_status_to_bc(shipment_id):
    # Wait for 5 minutes (300 seconds)
    time.sleep(300)
    
    # Fetch the shipment object and update the status
    try:
        shipment = Shipment.objects.get(id=shipment_id)
        shipment.status = 'OP'  # Change the status to 'Bidding Completed'
        shipment.save()
        print(f"Shipment ID {shipment.id} status updated to OP.")
    except Shipment.DoesNotExist:
        print(f"Shipment ID {shipment_id} not found during status update.")
        return

    # Fetch bid data
    bids_url = 'http://127.0.0.1:8000/api/bids/'
    bids_response = requests.get(bids_url)
    
    if bids_response.status_code == 200:
        bids = bids_response.json()
        bid = next((b for b in bids if int(b['shipment_id']) == shipment_id), None)
        
        if bid:
            bidder_id = bid['bidder_id']
            
            # Get the bidder's location
            user_url = f'http://127.0.0.1:8000/api/users/{bidder_id}/'
            user_response = requests.get(user_url)
            
            if user_response.status_code == 200:
                user = user_response.json()
                bidder_location = user['location']
                
                # Get the route ID from the shipment data
                route_id = shipment.route_id
                route_url = f'http://127.0.0.1:8000/api/routes/{route_id}/'
                
                # Patch the route with the bidder's current location as the new destination
                route_data = {
                    'destination': {
                        'lat': bidder_location['lat'],
                        'lon': bidder_location['lon']
                    }
                }
                
                patch_response = requests.patch(route_url, json=route_data)
                
                if patch_response.status_code == 200:
                    print(f"Route ID {route_id} destination updated to bidder's location.")
                else:
                    print(f"Failed to update route ID {route_id}. Status code: {patch_response.status_code}")
            else:
                print(f"Failed to get user with ID {bidder_id}. Status code: {user_response.status_code}")
        else:
            print(f"No bid found for shipment ID {shipment_id}.")
    else:
        print(f"Failed to fetch bids. Status code: {bids_response.status_code}")

@api_view(['GET', 'POST'])
def ship(request):
    """
    Handle GET and POST requests for shipments.
    GET: Return all shipments
    POST: Create a new shipment
    """
    if request.method == 'GET':
        shipments = Shipment.objects.all()
        serializer = ShipmentSerializer(shipments, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ShipmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'DELETE', 'PATCH'])
def ship_item(request, id):
    """
    Handle GET, DELETE, and PATCH requests for a single shipment.
    DELETE: Delete a shipment
    PATCH: Update a shipment's status or other fields
    """
    try:
        shipment = Shipment.objects.get(id=id)  # Retrieve shipment by ID
    except Shipment.DoesNotExist:
        return Response({'error': 'Shipment not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        # Handle DELETE request: delete a shipment by ID
        shipment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)  # No content to return after deletion

    elif request.method == 'GET':
        # Return a single shipment's details
        serializer = ShipmentSerializer(shipment)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        # Handle PATCH request: partially update a shipment by ID
        serializer = ShipmentSerializer(shipment, data=request.data, partial=True)
        if serializer.is_valid():
            # Save the original status before updating
            old_status = shipment.status
            updated_shipment = serializer.save()
            print(old_status)
            # If the status is 'OB' (On Bidding), start a timer to change it to 'BC' after 1 minute
            if updated_shipment.status == 'OB' and old_status != 'OB':
                # Start a new thread to handle the status change after 1 minute
                threading.Thread(target=change_shipment_status_to_bc, args=(updated_shipment.id,)).start()

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
