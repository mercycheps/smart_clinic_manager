from app import create_app, db
from models.user import User
from models.appointment import Appointment
from models.health_record import HealthRecord
from models.prescription import Prescription
from datetime import date, time

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    # Users
    admin = User(full_name='Super Admin', username='superadmin', email='admin@clinic.com', role='admin')
    admin.set_password('adminpass')

    doctor1 = User(full_name='Dr. Mwangi Kamau', username='drmwangi', email='mwangi@clinic.com', role='doctor')
    doctor1.set_password('docpass')

    doctor2 = User(full_name='Dr. Achieng Otieno', username='drachieng', email='achieng@clinic.com', role='doctor')
    doctor2.set_password('docpass')

    lab1 = User(full_name='LabTech Kelvin', username='kelvinlab', email='kelvin@clinic.com', role='lab')
    lab1.set_password('labpass')

    lab2 = User(full_name='LabTech Mary', username='marylab', email='mary@clinic.com', role='lab')
    lab2.set_password('labpass')

    patient1 = User(full_name='Wanjiru Muthoni', username='wanjirum', email='wanjiru@clinic.com', role='patient')
    patient1.set_password('wanjirupass')

    patient2 = User(full_name='Otieno Obiero', username='otienoo', email='otieno@clinic.com', role='patient')
    patient2.set_password('otienopass')

    db.session.add_all([admin, doctor1, doctor2, lab1, lab2, patient1, patient2])
    db.session.commit()

    # Appointments
    appt1 = Appointment(
        patient_id=patient1.id,
        field='cardiology',
        date=date(2025, 7, 10),
        time=time(10, 30),
        reason='Irregular heartbeat',
        status='pending'
    )

    appt2 = Appointment(
        patient_id=patient2.id,
        doctor_id=doctor1.id,
        field='cardiology',
        date=date(2025, 7, 11),
        time=time(14, 0),
        reason='Chest pain',
        status='approved'
    )

    appt3 = Appointment(
        patient_id=patient1.id,
        doctor_id=doctor2.id,
        field='orthopedics',
        date=date(2025, 7, 12),
        time=time(9, 0),
        reason='Knee injury',
        status='approved'
    )

    db.session.add_all([appt1, appt2, appt3])
    db.session.commit()

    # Health Records
    record2 = HealthRecord(
        appointment_id=appt2.id,
        lab_technician_id=lab1.id,
        lab_results='ECG normal, no blockage found',
        condition='Minor arrhythmia'
    )

    record3 = HealthRecord(
        appointment_id=appt3.id,
        lab_technician_id=lab2.id,
        lab_results='X-ray: ligament strain',
        condition='Ligament strain'
    )

    db.session.add_all([record2, record3])
    db.session.commit()

    # Prescriptions
    presc2 = Prescription(
        appointment_id=appt2.id,
        doctor_id=doctor1.id,
        patient_id=patient2.id,
        medications='Beta-blockers, rest, follow-up in 1 month'
    )

    presc3 = Prescription(
        appointment_id=appt3.id,
        doctor_id=doctor2.id,
        patient_id=patient1.id,
        medications='Pain relief gel, physiotherapy'
    )

    record2.prescription_id = presc2.id
    record3.prescription_id = presc3.id

    db.session.add_all([presc2, presc3])
    db.session.commit()

    print("✅ Database seeded.")
