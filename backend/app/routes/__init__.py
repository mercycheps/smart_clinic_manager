# app/routes/__init__.py
# Registers all role-based blueprints

from app.routes.auth import auth_bp
from app.routes.admin import admin_bp
from app.routes.patient import patient_bp
from app.routes.doctor import doctor_bp
from app.routes.labtech import labtech_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(patient_bp, url_prefix='/patient')
    app.register_blueprint(doctor_bp, url_prefix='/doctor')
    app.register_blueprint(labtech_bp, url_prefix='/labtech')
