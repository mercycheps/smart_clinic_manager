from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Prescription, User

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
    
    if not patient_id or not medication:
        return jsonify({"error": "Missing required fields"}), 400
    
    patient = User.query.get(patient_id)
    if not patient or patient.role != 'patient':
        return jsonify({"error": "Invalid patient ID"}), 400
    
    doctor = User.query.filter_by(username=identity['username']).first()
    
    prescription = Prescription(patient_id=patient_id, doctor_id=doctor.id, medication=medication)
    db.session.add(prescription)
    db.session.commit()
    
    return jsonify({
        "message": "Prescription created",
        "prescription_id": prescription.id
    }), 201

@prescription_bp.route('/prescriptions', methods=['GET'])
@jwt_required()
def get_prescriptions():
    identity = get_jwt_identity()
    user = User.query.filter_by(username=identity['username']).first()
    
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
            'patient': prescription.patient.username,
            'doctor': prescription.doctor.username,
            'medication': prescription.medication,
            'prescribed_at': prescription.prescribed_at.isoformat()
        } for prescription in prescriptions
    ]), 200