from django.urls import path
from .views import driverr,driverr_item

urlpatterns = [
    path('drivers/', driverr, name='driver-list-create'),
    path('drivers/<int:id>/', driverr_item, name='driver-detail'),
]
