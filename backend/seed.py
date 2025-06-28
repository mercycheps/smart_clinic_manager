from app import create_app
from models import db, User, Appointment, HealthRecord, Prescription
from datetime import datetime, timedelta

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

        # Add health records for each patient
        health_records = []
        for i, patient in enumerate(patients, start=1):
            health_records.append(
                HealthRecord(
                    patient_id=patient.id,
                    condition=f'Condition {i}'
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

        db.session.commit()
        print("Database seeded successfully with more doctors, patients, and medications!")

if __name__ == '__main__':
    seed_data()