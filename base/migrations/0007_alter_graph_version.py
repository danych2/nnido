# Generated by Django 5.0 on 2023-12-22 01:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0006_graph_version'),
    ]

    operations = [
        migrations.AlterField(
            model_name='graph',
            name='version',
            field=models.CharField(max_length=10),
        ),
    ]