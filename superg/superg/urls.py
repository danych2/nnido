from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from base import views, api

router = routers.DefaultRouter()
router.register(r'graphs', api.GraphViewSet, 'graphs')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('accounts.urls')),
    path('api/', include(router.urls)),
    re_path(r'^(?:.*)/', include('frontend.urls')),
    path('', include('frontend.urls')),
]
