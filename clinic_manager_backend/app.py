# clinic_manager_backend/run.py

from flask.cli import FlaskGroup
from clinic_manager_backend import create_app
from clinic_manager_backend.extensions import db
from clinic_manager_backend.models import *  # Ensure all models are imported for migrations

app = create_app()
cli = FlaskGroup(app)

if __name__ == '__main__':
    cli()
