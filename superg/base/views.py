from django.shortcuts import render, reverse
from django.http import HttpResponseRedirect, HttpResponse
from .models import Graph
from .forms import GraphForm
import networkx as nx
from networkx.readwrite import json_graph
import json

# Create your views here.

def home(request):
    all_graphs = Graph.objects.all()
    return render(request, "home.html", {'graphs':all_graphs})

def new(request):
    if request.method == 'POST':
        form = GraphForm(request.POST, request.FILES)
        if form.is_valid():
            graph = form.save(commit=False)
            G = nx.Graph()
            G_json = nx.readwrite.json_graph.node_link_data(G)
            graph.data = json.dumps(G_json)
            graph.save()
            return HttpResponseRedirect(reverse('home'))
    else:
        form = GraphForm()
    return render(request, "new.html", {'form': form})

def view(request, graph_id):
    if request.method == 'POST':
        graph = Graph.objects.get(pk = graph_id)
        graph.data = request.POST['data']
        graph.save()
    else:
        graph = Graph.objects.get(pk = graph_id)
    return render(request, "view.html", {'graph':graph})
