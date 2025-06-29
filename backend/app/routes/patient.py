from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.app.extensions import db
from backend.app.models.models import User, Appointment, LabResult, Prescription
from datetime import datetime

patient_bp = Blueprint('patient', __name__)

# Book an appointment
@patient_bp.route('/book', methods=['POST'])
@jwt_required()
def book_appointment():
    identity = get_jwt_identity()
    patient_id = identity['id']
    data = request.get_json()

    reason = data.get('reason')
    date_str = data.get('date')

    if not reason or not date_str:
        return jsonify({'msg': 'Please provide both reason and date'}), 400

    try:
        date = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        return jsonify({'msg': 'Invalid date format. Use YYYY-MM-DD'}), 400

    appointment = Appointment(
        patient_id=patient_id,
        reason=reason,
        date=date
    )
    db.session.add(appointment)
    db.session.commit()

    return jsonify({'msg': 'Appointment booked successfully. Await confirmation.'}), 201

# Get patient's appointments
@patient_bp.route('/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    identity = get_jwt_identity()
    patient_id = identity['id']

    appointments = Appointment.query.filter_by(patient_id=patient_id).order_by(Appointment.date.desc()).all()
    results = [{
        'id': a.id,
        'date': a.date.strftime('%Y-%m-%d'),
        'reason': a.reason,
        'status': a.status,
        'doctor': User.query.get(a.doctor_id).full_name if a.doctor_id else "Not assigned"
    } for a in appointments]

    return jsonify(results), 200

# Get lab results for patient
@patient_bp.route('/lab-results', methods=['GET'])
@jwt_required()
def get_lab_results():
    identity = get_jwt_identity()
    patient_id = identity['id']

    results = LabResult.query.filter_by(patient_id=patient_id).order_by(LabResult.created_at.desc()).all()
    output = [{
        'id': r.id,
        'test_description': r.test_description,
        'results': r.results or 'Pending',
        'created_at': r.created_at.strftime('%Y-%m-%d'),
        'labtech': User.query.get(r.labtech_id).full_name if r.labtech_id else "Not assigned"
    } for r in results]

    return jsonify(output), 200

# Get prescriptions for patient
@patient_bp.route('/prescriptions', methods=['GET'])
@jwt_required()
def get_prescriptions():
    identity = get_jwt_identity()
    patient_id = identity['id']

    prescriptions = Prescription.query.filter_by(patient_id=patient_id).order_by(Prescription.created_at.desc()).all()
    output = [{
        'id': p.id,
        'content': p.content,
        'created_at': p.created_at.strftime('%Y-%m-%d'),
        'doctor': User.query.get(p.doctor_id).full_name if p.doctor_id else "Not assigned"
    } for p in prescriptions]

    return jsonify(output), 200
