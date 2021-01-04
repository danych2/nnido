from .models import Graph
from rest_framework import viewsets, permissions
from .serializers import GraphSerializer
from django.db.models import Q

class GraphViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = GraphSerializer

    def get_queryset(self):
        return Graph.objects.filter(
            Q(owner=self.request.user) | Q(owner=None)
            )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)