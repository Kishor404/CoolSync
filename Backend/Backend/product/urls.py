from django.urls import path
from .views import product,product_item

urlpatterns = [
    path('products/', product, name='user-list-create'),
    path('products/<int:id>/', product_item, name='user-detail'),
]
