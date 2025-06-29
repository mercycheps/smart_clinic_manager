# clinic_manager_backend/run.py

from flask.cli import FlaskGroup
from backend.app.models import create_app
from backend.app.extensions import db
from backend.app.models.models import *  # Ensure all models are imported for migrations

app = create_app()
cli = FlaskGroup(app)

if __name__ == '__main__':
    cli()
