from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models.prescription import Prescription
from models.appointment import Appointment
from models.user import User

presc_bp = Blueprint('presc_bp', __name__)

# ✅ Doctor assigns prescription to a patient
@presc_bp.route('/assign', methods=['POST'])
@jwt_required()
def assign_prescription():
    usr = get_jwt_identity()
    if usr['role'] != 'doctor':
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    appt = Appointment.query.get(data['appointment_id'])
    if not appt or appt.doctor_id != usr['id']:
        return jsonify({"error": "Appointment not assigned"}), 404

    presc = Prescription(
        appointment_id=appt.id,
        doctor_id=usr['id'],
        patient_id=appt.patient_id,
        medications=data['medications']
    )
    db.session.add(presc)
    db.session.commit()
    return jsonify({"message": "Prescription assigned"}), 201

# ✅ Doctor views their own prescriptions
@presc_bp.route('/doctor/<int:did>', methods=['GET'])
@jwt_required()
def prescriptions_by_doctor(did):
    usr = get_jwt_identity()
    if usr['role'] != 'doctor' or usr['id'] != did:
        return jsonify({"error": "Unauthorized"}), 403

    prescs = Prescription.query.filter_by(doctor_id=did).all()
    return jsonify([
        {
            "id": p.id,
            "appointment_id": p.appointment_id,
            "patient_id": p.patient_id,
            "medications": p.medications
        } for p in prescs
    ]), 200

# ✅ Patient views their own prescriptions
@presc_bp.route('/patient/<int:pid>', methods=['GET'])
@jwt_required()
def prescriptions_by_patient(pid):
    usr = get_jwt_identity()
    if usr['role'] != 'patient' or usr['id'] != pid:
        return jsonify({"error": "Unauthorized"}), 403

    prescs = Prescription.query.filter_by(patient_id=pid).all()
    if not prescs:
        return jsonify({"message": "No prescriptions found"}), 200

    return jsonify([
        {
            "id": p.id,
            "appointment_id": p.appointment_id,
            "medications": p.medications
        } for p in prescs
    ]), 200

# ✅ Admin views all prescriptions
@presc_bp.route('/all', methods=['GET'])
@jwt_required()
def all_prescriptions():
    usr = get_jwt_identity()
    if usr['role'] != 'admin':
        return jsonify({"error": "Only admin can access all prescriptions"}), 403

    prescs = Prescription.query.all()
    if not prescs:
        return jsonify({"message": "No prescriptions found"}), 200

    return jsonify([
        {
            "id": p.id,
            "appointment_id": p.appointment_id,
            "doctor_id": p.doctor_id,
            "patient_id": p.patient_id,
            "medications": p.medications
        } for p in prescs
    ]), 200
