from flask import Flask, send_from_directory
from flask_migrate import Migrate
from app.extensions import db, jwt, cors
from app.routes import register_routes
from app.config import Config

migrate = Migrate()

def create_app():
    app = Flask(__name__, static_folder='frontend_build', static_url_path='')

    # Load config from app/config.py
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    register_routes(app)

    # Serve React frontend
    @app.route('/')
    def serve():
        return send_from_directory(app.static_folder, 'index.html')

    @app.errorhandler(404)
    def not_found(e):
        return send_from_directory(app.static_folder, 'index.html')

    return app
