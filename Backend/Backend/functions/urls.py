from django.urls import path
from .views import track_me, predict_demand_and_profit

urlpatterns = [
    path('trackme/', track_me, name='track_me'),
    path('demand/', predict_demand_and_profit, name='predict_demand_and_profit'),
]
