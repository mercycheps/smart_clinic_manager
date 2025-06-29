# clinic_manager_backend/__init__.py

from flask import Flask
from flask_migrate import Migrate
from clinic_manager_backend.extensions import db, jwt, cors
from clinic_manager_backend.routes import register_routes
from flask_cors import CORS
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # App Config
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:nene@localhost/collo_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'your-secret-key'

    # Initialize Extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    migrate.init_app(app, db)

    # Register Blueprints
    register_routes(app)

    return app
