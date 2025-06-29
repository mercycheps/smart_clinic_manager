# clinic_manager_backend/routes/admin.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from clinic_manager_backend.extensions import db
from clinic_manager_backend.models import User, Appointment, LabResult, Prescription
from datetime import datetime

admin_bp = Blueprint('admin', __name__)

# ✅ Get all registered users
@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    users = User.query.all()
    return jsonify([{
        'id': user.id,
        'full_name': user.full_name,
        'username': user.username,
        'role': user.role
    } for user in users]), 200

# ✅ Get all appointments
@admin_bp.route('/appointments', methods=['GET'])
@jwt_required()
def get_all_appointments():
    appointments = Appointment.query.all()
    return jsonify([{
        'id': a.id,
        'patient_id': a.patient_id,
        'patient_name': User.query.get(a.patient_id).full_name,
        'doctor_id': a.doctor_id,
        'doctor_name': User.query.get(a.doctor_id).full_name if a.doctor_id else None,
        'date': a.date.strftime('%Y-%m-%d'),
        'reason': a.reason,
        'status': a.status
    } for a in appointments]), 200

# ✅ Approve or reject appointment + optional doctor assignment
@admin_bp.route('/approve', methods=['POST'])
@jwt_required()
def approve_or_reject_appointment():
    data = request.get_json()
    appointment_id = data.get('appointment_id')
    status = data.get('status')
    doctor_id = data.get('doctor_id')  # Optional, only used for approval

    if status not in ['Approved', 'Rejected']:
        return jsonify({'msg': 'Invalid status'}), 400

    appointment = Appointment.query.get(appointment_id)
    if not appointment:
        return jsonify({'msg': 'Appointment not found'}), 404

    if status == 'Approved':
        if not doctor_id:
            return jsonify({'msg': 'Doctor ID required for approval'}), 400
        doctor = User.query.get(doctor_id)
        if not doctor or doctor.role != 'doctor':
            return jsonify({'msg': 'Invalid doctor ID'}), 400
        appointment.doctor_id = doctor_id

    appointment.status = status
    db.session.commit()

    return jsonify({'msg': f'Appointment {status.lower()} successfully.'}), 200

# ✅ Get all lab results
@admin_bp.route('/lab-results', methods=['GET'])
@jwt_required()
def get_all_lab_results():
    results = LabResult.query.all()
    return jsonify([{
        'id': r.id,
        'patient': User.query.get(r.patient_id).full_name,
        'labtech': User.query.get(r.labtech_id).full_name if r.labtech_id else None,
        'test_description': r.test_description,
        'results': r.results,
        'created_at': r.created_at.strftime('%Y-%m-%d') if r.created_at else None
    } for r in results]), 200

# ✅ Get all prescriptions
@admin_bp.route('/prescriptions', methods=['GET'])
@jwt_required()
def get_all_prescriptions():
    prescriptions = Prescription.query.all()
    return jsonify([{
        'id': p.id,
        'patient': User.query.get(p.patient_id).full_name,
        'doctor': User.query.get(p.doctor_id).full_name if p.doctor_id else None,
        'content': p.content,
        'created_at': p.created_at.strftime('%Y-%m-%d')
    } for p in prescriptions]), 200
