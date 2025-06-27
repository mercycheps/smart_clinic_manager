from flask import Blueprint, request, jsonify
from backend.models import db, Appointment, user
from datetime import datetime

appointments_bp = Blueprint('appointments', __name__, url_prefix='/appointments')

@appointments_bp.route('/appointments/', methods=['GET'])
def get_appointments():
    appointments = Appointment.query.all()
    return jsonify([{
        'id': appt.id,
        'doctor_id': appt.doctor_id,
        'patient_id': appt.patient_id,
        'date': appt.date.isoformat(),
        'description': appt.description
    } for appt in appointments]), 200


@appointments_bp.route('/', methods=['POST'])
def create_appointment():
    data = request.get_json()
    try:
        appointment = Appointment(
            doctor_id=data['doctor_id'],
            patient_id=data['patient_id'],
            date=datetime.fromisoformat(data['date']),
            description=data.get('description', '')
        )
        db.session.add(appointment)
        db.session.commit()
        return jsonify({'message': 'Appointment created', 'id': appointment.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400