from flask import Blueprint, request, jsonify
from models import db, HealthRecord, Appointment
from flask_jwt_extended import jwt_required, get_jwt_identity

health_bp = Blueprint('health_bp', __name__)

@health_bp.route('/', methods=['POST'])
@jwt_required()
def create_health_record():
    data = request.get_json()
    current_user_identity = get_jwt_identity()

    if current_user_identity['role'] != 'doctor':
        return jsonify({'message': 'Only doctors can create health records'}), 403

    appointment = Appointment.query.get(data['appointment_id'])
    if not appointment or appointment.doctor_id != current_user_identity['id']:
        return jsonify({'message': 'Appointment not found or not assigned to this doctor'}), 404

    new_record = HealthRecord(
        appointment_id=data['appointment_id'],
        doctor_notes=data['doctor_notes']
    )
    db.session.add(new_record)
    db.session.commit()
    return jsonify({'message': 'Health record created successfully', 'id': new_record.id}), 201

@health_bp.route('/appointment/<int:appointment_id>', methods=['GET'])
@jwt_required()
def get_health_record(appointment_id):
    record = HealthRecord.query.filter_by(appointment_id=appointment_id).first_or_404()
    return jsonify({
        'id': record.id,
        'appointment_id': record.appointment_id,
        'doctor_notes': record.doctor_notes
    }), 200