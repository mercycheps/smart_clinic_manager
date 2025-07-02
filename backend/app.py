# backend/app.py

from flask.cli import FlaskGroup
from app import create_app
from app.extensions import db
from app.models.models import *  # Import all models so Flask-Migrate can detect them

app = create_app()
cli = FlaskGroup(app)

if __name__ == '__main__':
    cli()
