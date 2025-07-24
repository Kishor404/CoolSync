# views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import User
from .serializers import UserSerializer

@api_view(['GET'])
def log(request):
    if request.method == 'GET':
        # Handle GET request: return all products
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

@api_view(['GET','DELETE', 'PATCH'])
def log_item(request, id):
    try:
        user = User.objects.get(id=id)  # Retrieve product by ID
    except User.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    elif request.method=='GET':
        try:
            users = User.objects.get(id=id) 
            serializer = UserSerializer(users) 
            return Response(serializer.data)  
        except User.DoesNotExist:
            return Response({'error': 'users not found'}, status=404)

    elif request.method == 'PATCH':
        # Handle PATCH request: partially update a product by ID
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# ========== LOGIN ============

@api_view(['POST'])
def login(request):
    phone=request.data.get('phone')
    password=request.data.get('password')
    try:
        user = User.objects.get(phone=phone)
    except User.DoesNotExist:
        return Response({"message": "Phone number not found",'login':0}, status=status.HTTP_404_NOT_FOUND)

    if user.password == password:
        return Response({"message": "Login successful",'login':1,'data':{'id': user.id, 'name': user.name, 'phone':user.phone, 'role':user.role, 'location':user.location}}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "Invalid password",'login':0}, status=status.HTTP_401_UNAUTHORIZED)
    
# ========== SIGNUP ============

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ========== GET USER =============


@api_view(['GET'])
def getoneuser(request, id):
    try:
        user = User.objects.get(id=id) 
        serializer = UserSerializer(user) 
        return Response(serializer.data)  
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404) 
