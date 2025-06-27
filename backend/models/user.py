<<<<<<< HEAD
from backend.models import db
=======
>>>>>>> 6e43a3582b8bd3e001eeafdb6b74ec7b19e29dc6
from werkzeug.security import generate_password_hash, check_password_hash
from app import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(512), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin', 'patient', 'doctor', 'lab'

    # Relationships
    appointments = db.relationship(
        'Appointment',
        back_populates='patient',
        foreign_keys='Appointment.patient_id'
    )

    assigned_appointments = db.relationship(
        'Appointment',
        back_populates='doctor',
        foreign_keys='Appointment.doctor_id'
    )

    prescriptions_given = db.relationship(
        'Prescription',
        back_populates='prescribing_doctor',
        foreign_keys='Prescription.doctor_id'
    )

    prescriptions_received = db.relationship(
        'Prescription',
        back_populates='receiving_patient',
        foreign_keys='Prescription.patient_id'
    )

    lab_health_records = db.relationship(
        'HealthRecord',
        back_populates='lab_technician',
        foreign_keys='HealthRecord.lab_technician_id'
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
