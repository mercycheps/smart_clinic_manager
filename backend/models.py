#
# Import necessary modules and initialize SQLAlchemy
from app import create_app
from models import db, User, Appointment, HealthRecord, Prescription
from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# LabTest model: stores lab test results, links to patient, doctor, and lab technician
class LabTest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # assigned doctor
    lab_technician_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    test_name = db.Column(db.String(120), nullable=False)
    result = db.Column(db.String(255), nullable=False)
    date_conducted = db.Column(db.DateTime, nullable=False)

    # Relationships for easier access
    patient = db.relationship('User', foreign_keys=[patient_id])
    doctor = db.relationship('User', foreign_keys=[doctor_id])
    lab_technician = db.relationship('User', foreign_keys=[lab_technician_id])

# HealthRecord model: stores medical conditions for each patient, assigned to a doctor
class HealthRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # assigned doctor
    condition = db.Column(db.String(120), nullable=False)

    # Relationships for easier access
    patient = db.relationship('User', foreign_keys=[patient_id])
    doctor = db.relationship('User', foreign_keys=[doctor_id])

# Helper function to check if a user can view a lab test
def can_view_lab_test(user, lab_test):
    return (
        user.role == 'admin' or
        user.id == lab_test.patient_id or
        user.id == lab_test.doctor_id or
        user.id == lab_test.lab_technician_id
    )

# Seeder function to populate the database with sample data
def seed_data():
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()
        
        # Add multiple patients
        patients = []
        for i in range(1, 6):
            patient = User(username=f'patient{i}', role='patient')
            patient.set_password('password123')
            patients.append(patient)
        # Add multiple doctors
        doctors = []
        for i in range(1, 4):
            doctor = User(username=f'doctor{i}', role='doctor')
            doctor.set_password('password123')
            doctors.append(doctor)
        # Add admin
        admin = User(username='admin1', role='admin')
        admin.set_password('password123')
        db.session.add_all(patients + doctors + [admin])
        db.session.commit()

        # Add appointments for each patient with different doctors
        appointments = []
        for i, patient in enumerate(patients, start=1):
            appointments.append(
                Appointment(
                    patient_id=patient.id,
                    doctor_id=doctors[i % len(doctors)].id,
                    appointment_date=datetime(2025, 6, 25, 10, 0) + timedelta(hours=i)
                )
            )
        db.session.add_all(appointments)

        # Add health records for each patient with real medical conditions
        health_conditions = [
            'Hypertension',
            'Diabetes Mellitus',
            'Asthma',
            'Chronic Kidney Disease',
            'Coronary Artery Disease'
        ]
        health_records = []
        for i, patient in enumerate(patients, start=1):
            health_records.append(
                HealthRecord(
                    patient_id=patient.id,
                    condition=health_conditions[(i-1) % len(health_conditions)],
                    doctor_id=doctors[(i-1) % len(doctors)].id  # assign doctor
                )
            )
        db.session.add_all(health_records)

        # Add prescriptions for each patient from different doctors with different medications
        prescriptions = []
        medications = [
            'Lisinopril 10mg daily',
            'Metformin 500mg twice daily',
            'Atorvastatin 20mg daily',
            'Amlodipine 5mg daily',
            'Omeprazole 20mg daily'
        ]
        for i, patient in enumerate(patients, start=1):
            prescriptions.append(
                Prescription(
                    patient_id=patient.id,
                    doctor_id=doctors[i % len(doctors)].id,
                    medication=medications[(i-1) % len(medications)]
                )
            )
        db.session.add_all(prescriptions)

        # Add lab technicians
        lab_technicians = []
        for i in range(1, 3):
            tech = User(username=f'labtech{i}', role='lab_technician')
            tech.set_password('password123')
            lab_technicians.append(tech)
        db.session.add_all(lab_technicians)
        db.session.commit()

        # Add lab tests for each patient
        lab_tests = []
        for i, patient in enumerate(patients, start=1):
            lab_tests.append(
                LabTest(
                    patient_id=patient.id,
                    doctor_id=doctors[(i-1) % len(doctors)].id,
                    lab_technician_id=lab_technicians[(i-1) % len(lab_technicians)].id,
                    test_name=f"Blood Test {i}",
                    result=f"Result {i}: Normal",
                    date_conducted=datetime(2025, 6, 25, 8, 0) + timedelta(days=i)
                )
            )
        db.session.add_all(lab_tests)
        db.session.commit()

        print("Database seeded successfully with more doctors, patients, lab technicians, and lab tests!")

# Helper function to check if a user can view a health record
def can_view_health_record(user, health_record):
    return (
        user.role == 'admin' or
        user.id == health_record.patient_id or
        user.id == health_record.doctor_id
    )

# Run the seeder if this file is executed directly
if __name__ == '__main__':
    seed_data()
