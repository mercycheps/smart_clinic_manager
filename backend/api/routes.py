from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import db
from .models import User, Patient, Appointment, HealthRecord, LabResult, Prescription
from datetime import datetime

api_bp = Blueprint('api', __name__)

@api_bp.route('/admin/users', methods=['GET'])
@jwt_required()
def admin_users():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403

    users = User.query.all()
    return jsonify({
        'users': [{
            'id': u.id,
            'full_name': u.full_name,
            'email': u.email,
            'phone_number': u.phone_number,
            'role': u.role
        } for u in users]
    }), 200

@api_bp.route('/admin/doctors', methods=['GET'])
@jwt_required()
def admin_doctors():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403

    doctors = User.query.filter_by(role='doctor').all()
    return jsonify({
        'doctors': [{
            'id': d.id,
            'full_name': d.full_name,
            'phone_number': d.phone_number,
            'field_of_medicine': d.field_of_medicine
        } for d in doctors]
    }), 200

@api_bp.route('/admin/appointments/<int:id>', methods=['PUT'])
@jwt_required()
def admin_update_appointment(id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403

    appointment = Appointment.query.get_or_404(id)
    data = request.get_json()
    status = data.get('status')
    doctor_id = data.get('doctor_id')
    rescheduled_date = data.get('rescheduled_date')

    if status not in ['pending', 'approved', 'rescheduled']:
        return jsonify({'message': 'Invalid status'}), 400

    if status == 'approved' and not doctor_id:
        return jsonify({'message': 'Doctor ID required for approval'}), 400

    if status == 'rescheduled' and not rescheduled_date:
        return jsonify({'message': 'Rescheduled date required'}), 400

    appointment.status = status
    if doctor_id:
        appointment.doctor_id = doctor_id
    if rescheduled_date:
        appointment.rescheduled_date = datetime.strptime(rescheduled_date, '%Y-%m-%d')
    db.session.commit()

    return jsonify({'message': 'Appointment updated successfully'}), 200

@api_bp.route('/patient/appointments/<int:user_id>', methods=['GET'])
@jwt_required()
def patient_appointments(user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role != 'patient' and user_id != 0 and user_id != current_user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    appointments = Appointment.query.filter_by(patient_id=user_id).all() if user_id != 0 else Appointment.query.all()
    return jsonify({
        'appointments': [{
            'id': a.id,
            'user_name': a.patient.full_name,
            'date': a.date.isoformat(),
            'reason': a.reason,
            'field_of_medicine': a.field_of_medicine,
            'status': a.status,
            'doctor_name': a.doctor.full_name if a.doctor else None,
            'rescheduled_date': a.rescheduled_date.isoformat() if a.rescheduled_date else None
        } for a in appointments]
    }), 200

@api_bp.route('/patient/appointments', methods=['POST'])
@jwt_required()
def book_appointment():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role != 'patient':
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    date = data.get('date')
    reason = data.get('reason')
    field_of_medicine = data.get('field_of_medicine')

    if not all([date, reason, field_of_medicine]):
        return jsonify({'message': 'Missing required fields'}), 400

    new_appointment = Appointment(
        patient_id=current_user_id,
        date=datetime.strptime(date, '%Y-%m-%d'),
        reason=reason,
        field_of_medicine=field_of_medicine
    )
    db.session.add(new_appointment)
    db.session.commit()

    return jsonify({'message': 'Appointment booked successfully'}), 201

@api_bp.route('/patient/health-records/<int:user_id>', methods=['GET'])
@jwt_required()
def patient_health_records(user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role not in ['patient', 'doctor'] or (user.role == 'patient' and user_id != current_user_id):
        return jsonify({'message': 'Unauthorized'}), 403

    records = HealthRecord.query.filter_by(user_id=user_id).all()
    return jsonify({
        'health_records': [{
            'id': r.id,
            'details': r.details,
            'created_at': r.created_at.isoformat()
        } for r in records]
    }), 200

@api_bp.route('/patient/lab-results/<int:user_id>', methods=['GET'])
@jwt_required()
def patient_lab_results(user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role not in ['patient', 'doctor', 'labtech'] or (user.role == 'patient' and user_id != current_user_id):
        return jsonify({'message': 'Unauthorized'}), 403

    results = LabResult.query.filter_by(user_id=user_id).all()
    return jsonify({
        'lab_results': [{
            'id': r.id,
            'test_name': r.test_name,
            'result': r.result,
            'created_at': r.created_at.isoformat()
        } for r in results]
    }), 200

@api_bp.route('/patient/prescriptions/<int:user_id>', methods=['GET'])
@jwt_required()
def patient_prescriptions(user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role not in ['patient', 'doctor'] or (user.role == 'patient' and user_id != current_user_id):
        return jsonify({'message': 'Unauthorized'}), 403

    prescriptions = Prescription.query.filter_by(user_id=user_id).all()
    return jsonify({
        'prescriptions': [{
            'id': p.id,
            'medication': p.medication,
            'dosage': p.dosage,
            'created_at': p.created_at.isoformat()
        } for p in prescriptions]
    }), 200

@api_bp.route('/doctor/patients/<int:doctor_id>', methods=['GET'])
@jwt_required()
def doctor_patients(doctor_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role != 'doctor' or doctor_id != current_user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    appointments = Appointment.query.filter_by(doctor_id=doctor_id).all()
    return jsonify({
        'patients': [{
            'id': a.patient.id,
            'full_name': a.patient.full_name,
            'date': a.date.isoformat(),
            'reason': a.reason
        } for a in appointments]
    }), 200

@api_bp.route('/doctor/prescriptions', methods=['POST'])
@jwt_required()
def add_prescription():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role != 'doctor':
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    user_id = data.get('user_id')
    medication = data.get('medication')
    dosage = data.get('dosage')

    if not all([user_id, medication, dosage]):
        return jsonify({'message': 'Missing required fields'}), 400

    prescription = Prescription(
        user_id=user_id,
        doctor_id=current_user_id,
        medication=medication,
        dosage=dosage
    )
    db.session.add(prescription)
    db.session.commit()

    return jsonify({'message': 'Prescription added successfully'}), 201

@api_bp.route('/labtech/patients/<int:lab_tech_id>', methods=['GET'])
@jwt_required()
def labtech_patients(lab_tech_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role != 'labtech' or lab_tech_id != current_user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    patients = User.query.filter_by(role='patient').all()
    return jsonify({
        'patients': [{
            'id': p.id,
            'full_name': p.full_name,
            'test_required': 'Pending'
        } for p in patients]
    }), 200

@api_bp.route('/labtech/lab-results', methods=['POST'])
@jwt_required()
def add_lab_result():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role != 'labtech':
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    user_id = data.get('user_id')
    test_name = data.get('test_name')
    result = data.get('result')

    if not all([user_id, test_name, result]):
        return jsonify({'message': 'Missing required fields'}), 400

    lab_result = LabResult(
        user_id=user_id,
        lab_tech_id=current_user_id,
        test_name=test_name,
        result=result
    )
    db.session.add(lab_result)
    db.session.commit()

    return jsonify({'message': 'Lab result added successfully'}), 201