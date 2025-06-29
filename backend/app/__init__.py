from flask import Flask, send_from_directory
from flask_migrate import Migrate
from backend.app.extensions import db, jwt, cors
from backend.routes import register_routes
import os

migrate = Migrate()

def create_app():
    # Point Flask to the built React frontend
    app = Flask(__name__, static_folder='frontend_build', static_url_path='')

    # App Config
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL", 'postgresql://postgres:nene@localhost/collo_db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get("JWT_SECRET_KEY", 'your-secret-key')

    # Initialize Extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    migrate.init_app(app, db)

    # Register Blueprints
    register_routes(app)

    # Serve React frontend
    @app.route('/')
    def serve():
        return send_from_directory(app.static_folder, 'index.html')

    @app.errorhandler(404)
    def not_found(e):
        return send_from_directory(app.static_folder, 'index.html')

    return app
