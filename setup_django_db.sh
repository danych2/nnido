#!/bin/bash

echo "Setting up Django database !"
python nnido/manage.py makemigrations
python nnido/manage.py migrate
echo "Django database was set successfully."
