from flask import Blueprint, request, jsonify
from models import db, Appointment, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

appointment_bp = Blueprint('appointment_bp', __name__)

@appointment_bp.route('/', methods=['POST'])
@jwt_required()
def create_appointment():
    data = request.get_json()
    current_user_identity = get_jwt_identity()

    if current_user_identity['role'] != 'patient':
        return jsonify({'message': 'Only patients can book appointments'}), 403

    new_appointment = Appointment(
        date_time=datetime.fromisoformat(data['date_time']),
        reason=data['reason'],
        patient_id=current_user_identity['id'],
        doctor_id=data['doctor_id']
    )
    db.session.add(new_appointment)
    db.session.commit()
    return jsonify({'message': 'Appointment created successfully', 'id': new_appointment.id}), 201

@appointment_bp.route('/', methods=['GET'])
@jwt_required()
def get_appointments():
    current_user_identity = get_jwt_identity()
    user = User.query.get(current_user_identity['id'])
    
    if user.role == 'patient':
        appointments = Appointment.query.filter_by(patient_id=user.id).all()
    elif user.role == 'doctor':
        appointments = Appointment.query.filter_by(doctor_id=user.id).all()
    elif user.role == 'admin':
        appointments = Appointment.query.all()
    else:
        return jsonify({'message': 'Unauthorized'}), 403

    output = []
    for appt in appointments:
        output.append({
            'id': appt.id,
            'date_time': appt.date_time.isoformat(),
            'reason': appt.reason,
            'patient_id': appt.patient_id,
            'doctor_id': appt.doctor_id
        })
    return jsonify(output), 200