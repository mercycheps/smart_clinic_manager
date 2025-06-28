from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()  # initialized globally

def create_app():
    app = Flask(__name__)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:nene@localhost/clinic_manager_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'your-secret-key'
    app.config['JWT_SECRET_KEY'] = 'your-jwt-secret-key'

    db.init_app(app)
    migrate.init_app(app, db)  # ✅ now safe to call here
    JWTManager(app)
    CORS(app)

    from .auth import auth_bp
    from .routes import api_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(api_bp, url_prefix="/api")

    return app
