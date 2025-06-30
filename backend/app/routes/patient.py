from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User, Appointment, LabResult, Prescription
from datetime import datetime

patient_bp = Blueprint('patient', __name__)

# ✅ Book an appointment
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


# ✅ Get all appointments for the patient
@patient_bp.route('/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    identity = get_jwt_identity()
    patient_id = identity['id']

    appointments = Appointment.query.filter_by(patient_id=patient_id).order_by(Appointment.date.desc()).all()
    result = []
    for appt in appointments:
        doctor = User.query.get(appt.doctor_id)
        result.append({
            'id': appt.id,
            'date': appt.date.strftime('%Y-%m-%d'),
            'reason': appt.reason,
            'status': appt.status,
            'doctor': doctor.full_name if doctor else "Not assigned"
        })

    return jsonify(result), 200


# ✅ Get lab results for the patient
@patient_bp.route('/lab-results', methods=['GET'])
@jwt_required()
def get_lab_results():
    identity = get_jwt_identity()
    patient_id = identity['id']

    results = LabResult.query.filter_by(patient_id=patient_id).order_by(LabResult.created_at.desc()).all()
    output = []
    for r in results:
        labtech = User.query.get(r.labtech_id)
        output.append({
            'id': r.id,
            'test_description': r.test_description or "No description",
            'results': r.results or 'Pending',
            'created_at': r.created_at.strftime('%Y-%m-%d') if r.created_at else "N/A",
            'labtech': labtech.full_name if labtech else "Not assigned"
        })

    return jsonify(output), 200


# ✅ Get prescriptions for the patient
@patient_bp.route('/prescriptions', methods=['GET'])
@jwt_required()
def get_prescriptions():
    identity = get_jwt_identity()
    patient_id = identity['id']

    prescriptions = Prescription.query.filter_by(patient_id=patient_id).order_by(Prescription.created_at.desc()).all()
    output = []
    for p in prescriptions:
        doctor = User.query.get(p.doctor_id)
        output.append({
            'id': p.id,
            'content': p.content,
            'created_at': p.created_at.strftime('%Y-%m-%d') if p.created_at else "N/A",
            'doctor': doctor.full_name if doctor else "Not assigned"
        })

    return jsonify(output), 200
