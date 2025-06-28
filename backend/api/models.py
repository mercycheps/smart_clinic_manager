from . import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)  # Increased from 128 to 255
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(15))
    role = db.Column(db.String(20), nullable=False)  # patient, doctor, admin, labtech
    field_of_medicine = db.Column(db.String(100))  # For doctors only
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Patient(db.Model):
    __tablename__ = 'patients'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    dob = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    user = db.relationship('User', backref=db.backref('patient', uselist=False))

class Appointment(db.Model):
    __tablename__ = 'appointments'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    date = db.Column(db.DateTime, nullable=False)
    reason = db.Column(db.Text, nullable=False)
    field_of_medicine = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, approved, rescheduled
    rescheduled_date = db.Column(db.DateTime)
    patient = db.relationship('User', foreign_keys=[patient_id], backref=db.backref('patient_appointments', lazy=True))
    doctor = db.relationship('User', foreign_keys=[doctor_id], backref=db.backref('doctor_appointments', lazy=True))

class HealthRecord(db.Model):
    __tablename__ = 'health_records'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    details = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', backref=db.backref('health_records', lazy=True))

class LabResult(db.Model):
    __tablename__ = 'lab_results'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    lab_tech_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    test_name = db.Column(db.String(100), nullable=False)
    result = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', foreign_keys=[user_id], backref=db.backref('lab_results', lazy=True))
    lab_tech = db.relationship('User', foreign_keys=[lab_tech_id], backref=db.backref('lab_tech_results', lazy=True))

class Prescription(db.Model):
    __tablename__ = 'prescriptions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    medication = db.Column(db.String(100), nullable=False)
    dosage = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', foreign_keys=[user_id], backref=db.backref('prescriptions', lazy=True))
    doctor = db.relationship('User', foreign_keys=[doctor_id], backref=db.backref('doctor_prescriptions', lazy=True))