from django.contrib import admin
from .models import Graph

class GraphAdmin(admin.ModelAdmin):
    pass
admin.site.register(Graph, GraphAdmin)