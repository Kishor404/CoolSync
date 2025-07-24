from django.urls import path
from .views import log,log_item,login,signup,getoneuser

urlpatterns = [
    path('users/', log, name='user-list-create'),
    path('users/<int:id>/', log_item, name='user-detail'),
    path('login/',login,name='user-login'),
    path('signup/',signup,name='user-signup'),
    path('getoneuser/<int:id>/',getoneuser,name='user-single')

]
