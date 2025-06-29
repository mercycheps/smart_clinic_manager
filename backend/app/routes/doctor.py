from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.app.extensions import db
from backend.app.models.models import User, Appointment, LabResult, Prescription, HealthRecord
from datetime import datetime

doctor_bp = Blueprint('doctor', __name__)

# Get assigned patients with their lab results
@doctor_bp.route('/patients', methods=['GET'])
@jwt_required()
def get_assigned_patients():
    identity = get_jwt_identity()
    doctor_id = identity['id']

    appointments = Appointment.query.filter_by(doctor_id=doctor_id).all()
    patients_info = []

    for appt in appointments:
        patient = User.query.get(appt.patient_id)
        lab_results = LabResult.query.filter_by(patient_id=patient.id).all()
        lab_results_data = [{
            'id': lr.id,
            'test_description': lr.test_description,
            'results': lr.results or 'Pending',
            'created_at': lr.created_at.strftime('%Y-%m-%d') if lr.created_at else None
        } for lr in lab_results]

        patients_info.append({
            'appointment_id': appt.id,
            'patient_id': patient.id,
            'patient_name': patient.full_name,
            'lab_results': lab_results_data
        })

    return jsonify(patients_info), 200

# Create a health record for a patient
@doctor_bp.route('/health-records', methods=['POST'])
@jwt_required()
def create_health_record():
    identity = get_jwt_identity()
    doctor_id = identity['id']
    data = request.get_json()

    patient_id = data.get('patient_id')
    notes = data.get('notes')

    if not patient_id or not notes:
        return jsonify({'msg': 'Missing patient_id or notes'}), 400

    record = HealthRecord(patient_id=patient_id, notes=notes)
    db.session.add(record)
    db.session.commit()

    return jsonify({'msg': 'Health record created'}), 201

# Create a prescription for a patient
@doctor_bp.route('/prescriptions', methods=['POST'])
@jwt_required()
def create_prescription():
    identity = get_jwt_identity()
    doctor_id = identity['id']
    data = request.get_json()

    patient_id = data.get('patient_id')
    content = data.get('content')

    if not patient_id or not content:
        return jsonify({'msg': 'Missing patient_id or content'}), 400

    prescription = Prescription(patient_id=patient_id, doctor_id=doctor_id, content=content)
    db.session.add(prescription)
    db.session.commit()

    return jsonify({'msg': 'Prescription created'}), 201

# Assign a lab test to a lab technician
@doctor_bp.route('/lab-tests', methods=['POST'])
@jwt_required()
def assign_lab_test():
    identity = get_jwt_identity()
    doctor_id = identity['id']
    data = request.get_json()

    patient_id = data.get('patient_id')
    labtech_id = data.get('labtech_id')
    test_description = data.get('test_description')

    if not patient_id or not labtech_id or not test_description:
        return jsonify({'msg': 'Missing required fields'}), 400

    lab_result = LabResult(
        patient_id=patient_id,
        doctor_id=doctor_id,
        labtech_id=labtech_id,
        test_description=test_description,
        results=None,
        created_at=None
    )
    db.session.add(lab_result)
    db.session.commit()

    return jsonify({'msg': 'Lab test assigned successfully'}), 201
