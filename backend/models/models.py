from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    fullName = db.Column(db.String(100))
    dob = db.Column(db.Date)
    phone = db.Column(db.String(20))
    address = db.Column(db.String(255))
    licenseNumber = db.Column(db.String(50))  # For doctors
    specialization = db.Column(db.String(100))  # For doctors
    certificationId = db.Column(db.String(50))  # For labtechs

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

class Appointment(db.Model):
    __tablename__ = 'appointments'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    appointment_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='scheduled')

    patient = db.relationship('User', foreign_keys=[patient_id], backref='patient_appointments')
    doctor = db.relationship('User', foreign_keys=[doctor_id], backref='doctor_appointments')

class Prescription(db.Model):
    __tablename__ = 'prescriptions'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    medication = db.Column(db.String(100), nullable=False)
    dosage = db.Column(db.String(50))
    prescribed_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    patient = db.relationship('User', foreign_keys=[patient_id], backref='prescriptions')
    doctor = db.relationship('User', foreign_keys=[doctor_id])

class HealthRecord(db.Model):
    __tablename__ = 'health_records'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    diagnosis = db.Column(db.String(255))
    record_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    patient = db.relationship('User', foreign_keys=[patient_id], backref='health_records')

class LabTest(db.Model):
    __tablename__ = 'lab_tests'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    labtech_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    test_name = db.Column(db.String(100), nullable=False)
    test_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    result = db.Column(db.String(255))

    patient = db.relationship('User', foreign_keys=[patient_id], backref='lab_tests')
    labtech = db.relationship('User', foreign_keys=[labtech_id])