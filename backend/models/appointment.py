from app import db
from datetime import time, date

class Appointment(db.Model):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)

    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    

    reason = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(50), default='pending')  # pending, approved, rescheduled, lab done, etc.

    # Relationships
    patient = db.relationship('User', foreign_keys=[patient_id], back_populates='appointments')
    doctor = db.relationship('User', foreign_keys=[doctor_id], back_populates='assigned_appointments')
    health_record = db.relationship('HealthRecord', back_populates='appointment', uselist=False)
    prescriptions = db.relationship('Prescription', back_populates='appointment', uselist=False)
