from flask import Flask, request, jsonify, abort
from flask_login import login_required, current_user
from datetime import datetime, timedelta
from app import create_app
from models import db, User, Appointment, HealthRecord, Prescription, can_view_health_record
from werkzeug.security import generate_password_hash

app = create_app()

# -------------------- Seeder Function -------------------- #
def seed_data():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Add patients
        patients = []
        for i in range(1, 6):
            patient = User(username=f'patient{i}', role='patient')
            patient.set_password('password123')
            patients.append(patient)

        # Add doctors
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

        # Add appointments
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

        # Add health records
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
                    condition=health_conditions[(i - 1) % len(health_conditions)]
                )
            )
        db.session.add_all(health_records)

        # Add prescriptions
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
                    medication=medications[(i - 1) % len(medications)]
                )
            )
        db.session.add_all(prescriptions)
        db.session.commit()

        print("Database seeded successfully with patients, doctors, and sample data!")

# -------------------- ROUTES -------------------- #

@app.route('/api/appointments', methods=['POST'])
@login_required
def book_appointment():
    if current_user.role != 'patient':
        return jsonify({"error": "Only patients can book appointments."}), 403

    data = request.get_json()
    doctor_id = data.get('doctor_id')
    appointment_date = data.get('appointment_date')

    if not doctor_id or not appointment_date:
        return jsonify({"error": "doctor_id and appointment_date are required."}), 400

    try:
        appt_datetime = datetime.strptime(appointment_date, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD HH:MM:SS"}), 400

    appointment = Appointment(
        patient_id=current_user.id,
        doctor_id=doctor_id,
        appointment_date=appt_datetime,
        status='pending'
    )
    db.session.add(appointment)
    db.session.commit()

    return jsonify({"msg": "Appointment booked successfully!"}), 201


@app.route('/api/appointments/<int:appointment_id>/approve', methods=['PUT'])
@login_required
def approve_appointment(appointment_id):
    if current_user.role != 'admin':
        abort(403, description="Only admin can approve appointments.")

    appointment = Appointment.query.get_or_404(appointment_id)
    data = request.get_json()

    appointment.status = data.get('status', 'approved')
    appointment.appointment_date = data.get('appointment_date', appointment.appointment_date)
    appointment.doctor_id = data.get('doctor_id', appointment.doctor_id)

    db.session.commit()
    return jsonify({"msg": "Appointment approved and updated by admin."})


@app.route('/api/appointments/<int:appointment_id>/reschedule', methods=['PUT'])
@login_required
def reschedule_appointment(appointment_id):
    if current_user.role != 'admin':
        abort(403, description="Only admin can reschedule appointments.")

    appointment = Appointment.query.get_or_404(appointment_id)
    data = request.get_json()
    appointment.appointment_date = data.get('appointment_date', appointment.appointment_date)
    db.session.commit()

    return jsonify({"msg": "Appointment rescheduled by admin."})


@app.route('/api/health_records/<int:record_id>', methods=['GET'])
@login_required
def get_health_record(record_id):
    health_record = HealthRecord.query.get_or_404(record_id)
    if not can_view_health_record(current_user, health_record):
        abort(403, description="You do not have permission to view this health record.")
    return jsonify(health_record.serialize())


@app.route('/api/health_records', methods=['GET'])
@login_required
def get_my_health_records():
    if current_user.role != 'patient':
        return jsonify({"error": "Only patients can view their own health records."}), 403
    records = HealthRecord.query.filter_by(patient_id=current_user.id).all()
    return jsonify([r.serialize() for r in records])


@app.route('/api/system/records', methods=['GET'])
@login_required
def view_all_system_records():
    if current_user.role != 'admin':
        abort(403, description="Only admin can view all system records.")

    users = User.query.all()
    appointments = Appointment.query.all()
    health_records = HealthRecord.query.all()
    prescriptions = Prescription.query.all()

    return jsonify({
        "users": [u.username for u in users],
        "appointments": [a.id for a in appointments],
        "health_records": [h.id for h in health_records],
        "prescriptions": [p.id for p in prescriptions]
    })


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if not username or not password or not role:
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    user = User(
        username=username,
        role=role,
        # Add optional fields here
    )
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": f"{role.capitalize()} registered successfully!"}), 201

# -------------------- Main -------------------- #
if __name__ == '__main__':
    seed_data()
