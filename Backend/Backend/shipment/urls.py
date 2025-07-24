from django.urls import path
from .views import ship,ship_item

urlpatterns = [
    path('shipment/', ship, name='shipment-list-create'),
    path('shipment/<int:id>/', ship_item, name='shipment-detail'),
]
