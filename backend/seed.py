# backend/seed.py

import os
import sys
from datetime import datetime
from werkzeug.security import generate_password_hash

# Ensure the app package is accessible
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

from app import create_app
from app.extensions import db
from app.models import User, Appointment  # ✅ Corrected import

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    # ✅ Create admin
    admin = User(
        username='admin',
        full_name='Admin User',
        role='admin',
        password=generate_password_hash('admin123')
    )

    # ✅ Create doctors
    doctors = [
        User(username='doctor1', full_name='Dr. Alice', role='doctor', password=generate_password_hash('doc123')),
        User(username='doctor2', full_name='Dr. Bob', role='doctor', password=generate_password_hash('doc123')),
        User(username='doctor3', full_name='Dr. Carol', role='doctor', password=generate_password_hash('doc123'))
    ]

    # ✅ Create lab technicians
    labtechs = [
        User(username='labtech1', full_name='Lab Tech Mike', role='labtech', password=generate_password_hash('lab123')),
        User(username='labtech2', full_name='Lab Tech Jane', role='labtech', password=generate_password_hash('lab123'))
    ]

    # ✅ Create patients
    patients = []
    for i in range(1, 6):
        patient = User(
            username=f'patient{i}',
            full_name=f'Patient {i}',
            role='patient',
            password=generate_password_hash('patient123')
        )
        patients.append(patient)

    # ✅ Add users to session
    db.session.add(admin)
    db.session.add_all(doctors + labtechs + patients)
    db.session.commit()

    # ✅ Create appointments
    appointments = []
    for i, patient in enumerate(patients, start=1):
        pending_appt = Appointment(
            patient_id=patient.id,
            date=datetime(2025, 7, i),
            reason=f"Consultation #{i}",
            status='Pending'
        )
        approved_appt = Appointment(
            patient_id=patient.id,
            doctor_id=doctors[i % len(doctors)].id,
            date=datetime(2025, 7, i + 1),
            reason=f"Follow-up #{i}",
            status='Approved'
        )
        appointments.extend([pending_appt, approved_appt])

    db.session.add_all(appointments)
    db.session.commit()

    print("✅ Seeded: 1 admin, 3 doctors, 2 lab techs, 5 patients, and 10 appointments.")
