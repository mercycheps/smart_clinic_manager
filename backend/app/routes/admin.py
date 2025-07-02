from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models import User, Appointment, LabResult, Prescription
from datetime import datetime

admin_bp = Blueprint('admin', __name__)

# ✅ View all users
@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    users = User.query.all()
    output = []
    for user in users:
        output.append({
            'id': user.id,
            'full_name': user.full_name,
            'username': user.username,
            'role': user.role,
            'gender': user.gender,
            'age': user.age
        })
    return jsonify(output), 200

# ✅ View all appointments
@admin_bp.route('/appointments', methods=['GET'])
@jwt_required()
def get_all_appointments():
    appointments = Appointment.query.all()
    output = []
    for appt in appointments:
        output.append({
            'id': appt.id,
            'patient_id': appt.patient_id,
            'patient_name': appt.patient.full_name if appt.patient else None,
            'doctor_id': appt.doctor_id,
            'doctor_name': appt.doctor.full_name if appt.doctor else None,
            'reason': appt.reason,
            'status': appt.status,
            'date': appt.date.isoformat() if appt.date else None
        })
    return jsonify(output), 200

# ✅ Approve + assign doctor
@admin_bp.route('/approve', methods=['POST'])
@jwt_required()
def approve_appointment():
    data = request.get_json()
    appointment_id = data.get('appointment_id')
    status = data.get('status')  # 'Approved' or 'Rejected'
    doctor_id = data.get('doctor_id')  # required if status == Approved

    appointment = Appointment.query.get(appointment_id)
    if not appointment:
        return jsonify({'msg': 'Appointment not found'}), 404

    if status not in ['Approved', 'Rejected']:
        return jsonify({'msg': 'Invalid status'}), 400

    appointment.status = status
    if status == 'Approved':
        if not doctor_id:
            return jsonify({'msg': 'Doctor ID required for approval'}), 400
        appointment.doctor_id = doctor_id

    db.session.commit()
    return jsonify({'msg': f'Appointment {status.lower()} successfully.'}), 200

# ✅ Reschedule appointment
@admin_bp.route('/appointments/reschedule', methods=['POST'])
@jwt_required()
def reschedule_appointment():
    data = request.get_json()
    appointment_id = data.get('appointment_id')
    new_date = data.get('new_date')

    appointment = Appointment.query.get(appointment_id)
    if not appointment:
        return jsonify({'msg': 'Appointment not found'}), 404

    try:
        appointment.date = datetime.fromisoformat(new_date)
        appointment.status = 'Rescheduled'
        db.session.commit()
        return jsonify({'msg': 'Appointment rescheduled'}), 200
    except Exception as e:
        return jsonify({'msg': f'Reschedule failed: {str(e)}'}), 400

# ✅ View all lab results
@admin_bp.route('/lab-results', methods=['GET'])
@jwt_required()
def get_all_lab_results():
    results = LabResult.query.all()
    output = []
    for res in results:
        output.append({
            'id': res.id,
            'patient': res.patient.full_name if res.patient else None,
            'doctor': res.doctor.full_name if res.doctor else None,
            'labtech': res.labtech.full_name if res.labtech else None,
            'test_description': res.test_description,
            'results': res.results,
            'created_at': res.created_at.isoformat() if res.created_at else None
        })
    return jsonify(output), 200

# ✅ View all prescriptions
@admin_bp.route('/prescriptions', methods=['GET'])
@jwt_required()
def get_all_prescriptions():
    prescriptions = Prescription.query.all()
    output = []
    for p in prescriptions:
        output.append({
            'id': p.id,
            'doctor': p.doctor.full_name if p.doctor else None,
            'patient': p.patient.full_name if p.patient else None,
            'content': p.content,
            'created_at': p.created_at.isoformat() if p.created_at else None
        })
    return jsonify(output), 200
