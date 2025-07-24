from django.contrib import admin
from django.urls import path, include  

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('prediction.urls')),
    path('api/', include('shipment.urls')),
    path('api/', include('user.urls')),  
    path('api/', include('product.urls')),  
    path('api/', include('bids.urls')),  
    path('api/', include('drivers.urls')),  
    path('api/', include('routes.urls')),  
    path('api/', include('device.urls')),  
    path('api/', include('functions.urls')),  
]