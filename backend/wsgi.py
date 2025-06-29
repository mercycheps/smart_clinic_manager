# clinic_manager_backend/wsgi.py

from backend.app.models import create_app
app = create_app()
