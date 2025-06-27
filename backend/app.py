import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from config import app_config
from models import db
from controllers.user_controller import user_bp
from controllers.appointment_controller import appointment_bp
from controllers.health_record_controller import health_record_bp
from controllers.prescription_controller import prescription_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(app_config['production'])
    
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)
    
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(appointment_bp, url_prefix='/api')
    app.register_blueprint(health_record_bp, url_prefix='/api')
    app.register_blueprint(prescription_bp, url_prefix='/api')
    
    @app.route('/')
    def home():
        return {"message": "Welcome to Smart Clinic Manager"}, 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)