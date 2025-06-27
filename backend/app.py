import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

from config import app_config
from backend.models import db
from controllers.user_controller import user_bp
from controllers.appointment_controller import appointment_bp
from controllers.health_record_controller import health_record_bp
from controllers.prescription_controller import prescription_bp
from routes.file_upload import file_upload_bp  # ✅ import file upload blueprint

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def create_app():
    app = Flask(__name__)
    app.config.from_object(app_config['production'])

    # Setup upload folder
    upload_path = os.path.join(os.getcwd(), 'instance', 'uploads')
    os.makedirs(upload_path, exist_ok=True)
    app.config['UPLOAD_FOLDER'] = upload_path
    app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB limit

    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    # Register blueprints
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(appointment_bp, url_prefix='/api')
    app.register_blueprint(health_record_bp, url_prefix='/api')
    app.register_blueprint(prescription_bp, url_prefix='/api')
    app.register_blueprint(file_upload_bp, url_prefix='/api')  # ✅ register file upload

    @app.route('/')
    def home():
        return {"message": "Welcome to Smart Clinic Manager"}, 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
