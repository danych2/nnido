from .models import Graph
from rest_framework import viewsets, permissions
from .serializers import GraphSerializer
from django.db.models import Q

class GraphViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = GraphSerializer

    def get_queryset(self):
        if (self.request.user.is_authenticated):
            return Graph.objects.filter(owner=self.request.user)
        return Graph.objects.filter(owner=None)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)