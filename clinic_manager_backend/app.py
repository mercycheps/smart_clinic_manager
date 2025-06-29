# run.py

from flask import Flask
from extensions import db, jwt, cors
from models import *
from flask_migrate import Migrate
from routes import register_routes

import config

migrate = Migrate()  # <-- Added globally

def create_app():
    app = Flask(__name__)
    app.config.from_object(config)

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    migrate.init_app(app, db)  

    register_routes(app)
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=3005)
