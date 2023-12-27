# nnido

nnido will be a multi-paradigm collaborative nonlinear knowledge manager
at the moment it is just a mind-mapping/diagramming tool

## Installation

You'll first need [Python 3](https://www.python.org/downloads/). You can use a [virtual environment](https://virtualenv.pypa.io/en/latest/#) if you don't want this installation to conflicts with other Python projects you might have.
Then you'll need [Django](https://www.djangoproject.com/) and a few other packages ([Django REST framework](https://www.django-rest-framework.org/), [django-cors-headers](https://github.com/adamchainz/django-cors-headers), [django-rest-knox](https://github.com/James1345/django-rest-knox) and [NetworkX](https://networkx.org/)). I used Django 2.2.2, it will probably also work with other versions but I recommend using this one just to be sure.

You can install those packages using the following command from within the virtual environment you created earlier:

```bash
pip install -r requirements.txt
```

Then to setup the Django database you'll need to run the following:
```bash
python manage.py makemigrations
python manage.py migrate
```

And you will also need to at least create an admin user in order to be able to [create other users](https://docs.djangoproject.com/en/3.1/topics/auth/default/#managing-users-in-the-admin), since regular signing up through the app is currently disabled:
```bash
python manage.py createsuperuser
```

If you want to make changes to the interface you'll also need to install [nodejs/npm](https://nodejs.org/en/download/). To automatically install all dependencies that are required run:
```bash
npm install
```

If any of this doesn't work please let me know!

## Usage

To run the server:
```bash
python manage.py runserver
```

To run npm/webpack so that it autocompiles while modifying the code:
```bash
npm run dev
```

## Contributing
Everything is subject to changes at the moment, so any suggestion/idea/criticism/etc is welcome. Feel free to open issues or to write me at dduato@gmail.com

Pull requests are welcome.

## License
[MIT](https://choosealicense.com/licenses/mit/)