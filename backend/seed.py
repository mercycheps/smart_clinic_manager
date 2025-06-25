from app import create_app
from models import db, User, Appointment, HealthRecord, Prescription
from datetime import datetime

def seed_data():
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()
        
        patient = User(username='patient1', role='patient')
        patient.set_password('password123')
        doctor = User(username='doctor1', role='doctor')
        doctor.set_password('password123')
        admin = User(username='admin1', role='admin')
        admin.set_password('password123')
        db.session.add_all([patient, doctor, admin])
        
        appointment = Appointment(patient_id=1, appointment_date=datetime(2025, 6, 25, 10, 0))
        db.session.add(appointment)
        
        health_record = HealthRecord(patient_id=1, condition='Hypertension')
        db.session.add(health_record)
        
        prescription = Prescription(patient_id=1, doctor_id=2, medication='Lisinopril 10mg daily')
        db.session.add(prescription)
        
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_data()