from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import app_config
from models import db
from controllers.user_controller import user_bp
from controllers.appointment_controller import appointment_bp
from controllers.health_record_controller import health_record_bp
from controllers.prescription_controller import prescription_bp

migrate = Migrate()
jwt = JWTManager()

def create_app(config_name='production'):
    app = Flask(__name__)
    app.config.from_object(app_config[config_name])
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Allow multiple origins for development
    CORS(app, resources={r"/api/*": {"origins": [
        "http://localhost:5176",
        "http://localhost:5175",
        "http://localhost:5173",
        "http://192.168.1.3:5177"
    ]}}, supports_credentials=True)

    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(appointment_bp, url_prefix='/api')
    app.register_blueprint(health_record_bp, url_prefix='/api')
    app.register_blueprint(prescription_bp, url_prefix='/api')

    @app.route('/')
    def home():
        return jsonify({"message": "Welcome to Smart Clinic Manager"}), 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0')  # Allow external access