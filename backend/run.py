from flask.cli import FlaskGroup
from app import create_app
from app.extensions import db
from app.models import *  # ✅ Import all models via __init__.py

app = create_app()
cli = FlaskGroup(app)

if __name__ == '__main__':
    cli()
