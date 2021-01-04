
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('new/', views.new, name='new'),
    path('view/<int:graph_id>/', views.view, name='view')
]
