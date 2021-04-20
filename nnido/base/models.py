from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Graph(models.Model):
    name = models.CharField(max_length=50)
    date = models.DateTimeField('date of creation', auto_now_add=True)
    data = models.TextField()
    version = models.CharField(max_length=10)
    visualization = models.TextField(null=True)
    model = models.TextField(null=True)
    owner = models.ForeignKey(User, related_name="graphs", on_delete=models.CASCADE, null=True)
    def __str__(self):
        return self.name