import os

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'supersecret123')

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'postgresql://postgres:nene@localhost:5432/smart_clinic_db')

app_config = {
    'production': ProductionConfig
}