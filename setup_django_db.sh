#!/bin/bash

python nnido/manage.py makemigrations
python nnido/manage.py migrate
