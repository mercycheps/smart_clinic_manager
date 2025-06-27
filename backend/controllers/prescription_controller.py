from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Prescription, User
from datetime import datetime

prescription_bp = Blueprint('prescription', __name__)

@prescription_bp.route('/prescriptions', methods=['POST'])
@jwt_required()
def create_prescription():
    identity = get_jwt_identity()
    if identity['role'] != 'doctor':
        return jsonify({"error": "Only doctors can create prescriptions"}), 403
    
    data = request.get_json()
    patient_id = data.get('patient_id')
    medication = data.get('medication')
    dosage = data.get('dosage')
    frequency = data.get('frequency')
    
    if not patient_id or not medication or not dosage or not frequency:
        return jsonify({"error": "Missing required fields: patient_id, medication, dosage, frequency"}), 400
    
    patient = User.query.get(patient_id)
    if not patient or patient.role != 'patient':
        return jsonify({"error": "Invalid patient ID"}), 400
    
    doctor = User.query.filter_by(username=identity['username']).first()
    if not doctor:
        return jsonify({"error": "Doctor not found"}), 404
    
    prescription = Prescription(
        patient_id=patient_id,
        doctor_id=doctor.id,
        medication=medication,
        dosage=dosage,
        frequency=frequency,
        status='active',
        prescribed_at=datetime.utcnow()
    )
    db.session.add(prescription)
    db.session.commit()
    
    return jsonify({
        "message": "Prescription created successfully",
        "prescription_id": prescription.id
    }), 201

@prescription_bp.route('/prescriptions', methods=['GET'])
@jwt_required()
def get_prescriptions():
    identity = get_jwt_identity()
    user = User.query.filter_by(username=identity['username']).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if identity['role'] == 'patient':
        prescriptions = Prescription.query.filter_by(patient_id=user.id).all()
    elif identity['role'] == 'doctor':
        prescriptions = Prescription.query.filter_by(doctor_id=user.id).all()
    elif identity['role'] == 'admin':
        prescriptions = Prescription.query.all()
    else:
        return jsonify({"error": "Invalid role"}), 403
    
    return jsonify([
        {
            'id': prescription.id,
            'patient_id': prescription.patient_id,
            'patient': prescription.patient.username if prescription.patient else None,
            'doctor': prescription.doctor.username if prescription.doctor else None,
            'medication': prescription.medication,
            'dosage': prescription.dosage,
            'frequency': prescription.frequency,
            'status': prescription.status,
            'prescribed_at': prescription.prescribed_at.isoformat()
        } for prescription in prescriptions
    ]), 200