from flask import Blueprint, request, jsonify
from models import db, Prescription, HealthRecord
from flask_jwt_extended import jwt_required, get_jwt_identity

prescription_bp = Blueprint('prescription_bp', __name__)

@prescription_bp.route('/', methods=['POST'])
@jwt_required()
def create_prescription():
    data = request.get_json()
    current_user_identity = get_jwt_identity()

    if current_user_identity['role'] != 'doctor':
        return jsonify({'message': 'Only doctors can create prescriptions'}), 403

    health_record = HealthRecord.query.get(data['health_record_id'])
    if not health_record:
        return jsonify({'message': 'Health record not found'}), 404
    
    # Optional: Check if the doctor creating the prescription is the one who owns the health record's appointment
    
    new_prescription = Prescription(
        health_record_id=data['health_record_id'],
        medication=data['medication'],
        dosage=data['dosage']
    )
    db.session.add(new_prescription)
    db.session.commit()
    return jsonify({'message': 'Prescription created successfully', 'id': new_prescription.id}), 201

@prescription_bp.route('/record/<int:record_id>', methods=['GET'])
@jwt_required()
def get_prescription(record_id):
    prescription = Prescription.query.filter_by(health_record_id=record_id).first_or_404()
    return jsonify({
        'id': prescription.id,
        'health_record_id': prescription.health_record_id,
        'medication': prescription.medication,
        'dosage': prescription.dosage
    }), 200