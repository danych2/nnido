from rest_framework import serializers
from .models import Graph

class GraphSerializer(serializers.ModelSerializer):
    class Meta:
        model = Graph
        fields = ['name', 'data', 'date', 'visualization', 'model', 'pk']
