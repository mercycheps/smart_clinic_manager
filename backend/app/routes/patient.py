from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User, Appointment, LabResult, Prescription
from datetime import datetime

patient_bp = Blueprint('patient', __name__)

# ✅ Book an appointment (expects reason and date)
@patient_bp.route('/book', methods=['POST'])
@jwt_required()
def book_appointment():
    identity = get_jwt_identity()
    patient_id = identity['id']
    data = request.get_json()

    reason = data.get('reason')
    date_str = data.get('date')

    if not reason or not date_str:
        return jsonify({'msg': '❌ Reason and date are required'}), 422

    try:
        appointment_date = datetime.strptime(date_str, '%Y-%m-%d')
    except ValueError:
        return jsonify({'msg': '❌ Invalid date format. Use YYYY-MM-DD'}), 400

    new_appt = Appointment(
        patient_id=patient_id,
        reason=reason,
        status='Pending',
        date=appointment_date
    )
    db.session.add(new_appt)
    db.session.commit()

    return jsonify({'msg': '✅ Appointment booked successfully'}), 201

# ✅ View own appointments
@patient_bp.route('/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    identity = get_jwt_identity()
    patient_id = identity['id']

    appointments = Appointment.query.filter_by(patient_id=patient_id).all()
    output = []
    for appt in appointments:
        doctor = User.query.get(appt.doctor_id) if appt.doctor_id else None
        output.append({
            'id': appt.id,
            'date': appt.date.isoformat(),
            'status': appt.status,
            'reason': appt.reason,
            'doctor_id': appt.doctor_id,
            'doctor_name': doctor.full_name if doctor else 'Not Assigned'
        })
    return jsonify(output), 200

# ✅ View lab results
@patient_bp.route('/lab-results', methods=['GET'])
@jwt_required()
def get_lab_results():
    identity = get_jwt_identity()
    patient_id = identity['id']

    results = LabResult.query.filter_by(patient_id=patient_id).all()
    output = []
    for res in results:
        output.append({
            'id': res.id,
            'test_description': res.test_description,
            'results': res.results,
            'labtech_id': res.labtech_id,
            'doctor_id': res.doctor_id,
            'created_at': res.created_at.isoformat() if res.created_at else None
        })
    return jsonify(output), 200

# ✅ View prescriptions
@patient_bp.route('/prescriptions', methods=['GET'])
@jwt_required()
def get_prescriptions():
    identity = get_jwt_identity()
    patient_id = identity['id']

    prescriptions = Prescription.query.filter_by(patient_id=patient_id).all()
    output = []
    for p in prescriptions:
        doctor = User.query.get(p.doctor_id)
        output.append({
            'id': p.id,
            'doctor_id': p.doctor_id,
            'doctor_name': doctor.full_name if doctor else 'Unknown',
            'content': p.notes,
            'created_at': p.created_at.isoformat() if p.created_at else None
        })
    return jsonify(output), 200
