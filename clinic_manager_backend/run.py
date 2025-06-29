# run.py

from flask import Flask
from clinic_manager_backend.config import Config
from clinic_manager_backend.extensions import db, jwt, cors, migrate
from clinic_manager_backend.models import *  # Optional: import specific models instead
from clinic_manager_backend.routes import register_routes

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    migrate.init_app(app, db)

    register_routes(app)
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
