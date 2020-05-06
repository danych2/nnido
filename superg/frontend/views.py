from django.shortcuts import render
from base.models import Graph

def home(request):
    return render(request, 'frontend/home.html')

def view(request, graph_id):
    if request.method == 'POST':
        graph = Graph.objects.get(pk = graph_id)
        graph.data = request.POST['data']
        graph.save()
    else:
        graph = Graph.objects.get(pk = graph_id)
    return render(request, "frontend/view.html", {'graph':graph})
