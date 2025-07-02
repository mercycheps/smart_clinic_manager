from app.extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(50), nullable=False)  # patient, doctor, admin, labtech
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    full_name = db.Column(db.String(200), nullable=False)

    # ✅ Add missing fields
    gender = db.Column(db.String(10), nullable=True)
    age = db.Column(db.Integer, nullable=True)

    # Relationships
    appointments = db.relationship('Appointment', backref='patient', lazy=True, foreign_keys='Appointment.patient_id')
    assigned_appointments = db.relationship('Appointment', backref='doctor', lazy=True, foreign_keys='Appointment.doctor_id')

    lab_results_as_tech = db.relationship('LabResult', backref='labtech', lazy=True, foreign_keys='LabResult.labtech_id')
    lab_results_as_patient = db.relationship('LabResult', backref='patient_user', lazy=True, foreign_keys='LabResult.patient_id')

    prescriptions_given = db.relationship('Prescription', backref='doctor', lazy=True, foreign_keys='Prescription.doctor_id')
    prescriptions_received = db.relationship('Prescription', backref='patient_user', lazy=True, foreign_keys='Prescription.patient_id')
