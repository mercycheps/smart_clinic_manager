from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User, Appointment, LabResult, Prescription, HealthRecord
from datetime import datetime

doctor_bp = Blueprint('doctor', __name__)

# ✅ View assigned patients
@doctor_bp.route('/patients', methods=['GET'])
@jwt_required()
def get_assigned_patients():
    identity = get_jwt_identity()
    doctor_id = identity["id"]
    appointments = Appointment.query.filter_by(doctor_id=doctor_id, status='Approved').all()

    patients_data = []
    for appt in appointments:
        patient = User.query.get(appt.patient_id)
        if patient:
            lab_results = LabResult.query.filter_by(patient_id=patient.id).all()
            patients_data.append({
                'appointment_id': appt.id,
                'patient_id': patient.id,
                'patient_name': patient.full_name,
                'reason': appt.reason,
                'date': appt.date.isoformat() if appt.date else None,
                'lab_results': [{
                    'id': r.id,
                    'test_description': r.test_description,
                    'results': r.results,
                    'created_at': r.created_at.isoformat() if r.created_at else None
                } for r in lab_results]
            })

    return jsonify(patients_data), 200

# ✅ View individual patient details
@doctor_bp.route('/patient/<int:patient_id>', methods=['GET'])
@jwt_required()
def get_patient_details(patient_id):
    patient = User.query.get(patient_id)
    if not patient or patient.role != 'patient':
        return jsonify({'msg': 'Patient not found'}), 404

    return jsonify({
        'id': patient.id,
        'full_name': patient.full_name,
        'username': patient.username,
        'gender': patient.gender,
        'age': patient.age
    }), 200

# ✅ Assign lab test to labtech
@doctor_bp.route('/lab-tests', methods=['POST'])
@jwt_required()
def assign_lab_test():
    identity = get_jwt_identity()
    doctor_id = identity["id"]
    data = request.get_json()

    patient_id = data.get('patient_id')
    labtech_id = data.get('labtech_id')
    test_description = data.get('test_description')

    if not all([patient_id, labtech_id, test_description]):
        return jsonify({'msg': 'All fields are required'}), 400

    lab_result = LabResult(
        patient_id=patient_id,
        doctor_id=doctor_id,
        labtech_id=labtech_id,
        test_description=test_description,
        results=None
    )
    db.session.add(lab_result)
    db.session.commit()

    return jsonify({'msg': '✅ Lab test assigned.'}), 201

# ✅ View lab results for a patient
@doctor_bp.route('/lab-results/<int:patient_id>', methods=['GET'])
@jwt_required()
def view_lab_results(patient_id):
    results = LabResult.query.filter_by(patient_id=patient_id).all()
    output = []
    for r in results:
        output.append({
            'id': r.id,
            'test_description': r.test_description,
            'results': r.results,
            'labtech': r.labtech.full_name if r.labtech else None,
            'created_at': r.created_at.isoformat() if r.created_at else None
        })
    return jsonify(output), 200

# ✅ Add health record (notes)
@doctor_bp.route('/health-records', methods=['POST'])
@jwt_required()
def create_health_record():
    identity = get_jwt_identity()
    doctor_id = identity["id"]
    data = request.get_json()

    patient_id = data.get('patient_id')
    notes = data.get('notes')

    if not all([patient_id, notes]):
        return jsonify({'msg': 'patient_id and notes are required'}), 400

    record = HealthRecord(
        doctor_id=doctor_id,
        patient_id=patient_id,
        notes=notes
    )
    db.session.add(record)
    db.session.commit()

    return jsonify({'msg': '✅ Health record created.'}), 201

# ✅ Issue prescription
@doctor_bp.route('/prescriptions', methods=['POST'])
@jwt_required()
def issue_prescription():
    identity = get_jwt_identity()
    doctor_id = identity["id"]
    data = request.get_json()

    patient_id = data.get('patient_id')
    content = data.get('content')

    if not all([patient_id, content]):
        return jsonify({'msg': 'patient_id and content required'}), 400

    prescription = Prescription(
        doctor_id=doctor_id,
        patient_id=patient_id,
        content=content
    )
    db.session.add(prescription)
    db.session.commit()

    return jsonify({'msg': '✅ Prescription sent.'}), 201
