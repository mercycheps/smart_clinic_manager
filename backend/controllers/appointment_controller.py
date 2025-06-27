from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Appointment, User
from datetime import datetime

appointment_bp = Blueprint('appointment', __name__)

@appointment_bp.route('/appointments', methods=['POST'])
@jwt_required()
def book_appointment():
    identity = get_jwt_identity()
    if identity['role'] != 'patient':
        return jsonify({"error": "Only patients can book appointments"}), 403
    
    data = request.get_json()
    appointment_date = data.get('appointment_date')
    
    if not appointment_date:
        return jsonify({"error": "Appointment date is required"}), 400
    
    try:
        appointment_date = datetime.strptime(appointment_date, '%Y-%m-%d %H:%M')
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD HH:MM"}), 400
    
    patient = User.query.filter_by(username=identity['username']).first()
    if not patient:
        return jsonify({"error": "Patient not found"}), 404
    
    appointment = Appointment(
        patient_id=patient.id,
        appointment_date=appointment_date,
        status='pending'
    )
    db.session.add(appointment)
    db.session.commit()
    
    return jsonify({
        "message": "Appointment booked successfully",
        "appointment_id": appointment.id
    }), 201

@appointment_bp.route('/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    identity = get_jwt_identity()
    user = User.query.filter_by(username=identity['username']).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if identity['role'] == 'patient':
        appointments = Appointment.query.filter_by(patient_id=user.id).all()
    elif identity['role'] == 'doctor':
        appointments = Appointment.query.filter_by(doctor_id=user.id).all()
    elif identity['role'] == 'admin':
        appointments = Appointment.query.all()
    else:
        return jsonify({"error": "Invalid role"}), 403
    
    return jsonify([
        {
            'id': appt.id,
            'patient': appt.patient.username if appt.patient else None,
            'doctor': appt.doctor.username if appt.doctor else None,
            'appointment_date': appt.appointment_date.isoformat(),
            'status': appt.status
        } for appt in appointments
    ]), 200

@appointment_bp.route('/appointments/<int:id>/approve', methods=['PUT'])
@jwt_required()
def approve_appointment(id):
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({"error": "Only admins can approve appointments"}), 403
    
    appointment = Appointment.query.get_or_404(id)
    data = request.get_json()
    doctor_id = data.get('doctor_id')
    appointment_date = data.get('appointment_date')
    
    if not doctor_id:
        return jsonify({"error": "Doctor ID is required"}), 400
    
    doctor = User.query.get(doctor_id)
    if not doctor or doctor.role != 'doctor':
        return jsonify({"error": "Invalid doctor ID"}), 400
    
    if appointment_date:
        try:
            appointment.appointment_date = datetime.strptime(appointment_date, '%Y-%m-%d %H:%M')
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD HH:MM"}), 400
    
    appointment.doctor_id = doctor_id
    appointment.status = 'approved'
    db.session.commit()
    
    return jsonify({"message": "Appointment approved successfully"}), 200