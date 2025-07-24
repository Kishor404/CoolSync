from django.urls import path
from .views import devicess,devicess_item

urlpatterns = [
    path('devices/', devicess, name='device-list-create'),
    path('devices/<int:id>/', devicess_item, name='device-detail'),
]
