from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from config import Config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize app with extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Import and register blueprints
    from controllers.user_controller import user_bp
    from controllers.appointment_controller import appointment_bp
    from controllers.health_record_controller import hr_bp
    from controllers.prescription_controller import presc_bp

    # ✅ Set correct URL prefixes so routes work as expected
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(appointment_bp, url_prefix='/api/appointments')
    app.register_blueprint(hr_bp, url_prefix='/api/health_records')
    app.register_blueprint(presc_bp, url_prefix='/api/prescriptions')

    # Optional: Root route to check server is running
    @app.route('/')
    def index():
        return {'message': 'Smart Clinic API is running.'}, 200

    return app
