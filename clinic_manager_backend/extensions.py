# extensions.py

from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate  # ✅ Add this line

db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()
migrate = Migrate()  # ✅ Add this line
