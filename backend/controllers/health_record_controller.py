from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models.health_record import HealthRecord
from models.appointment import Appointment
from models.user import User

hr_bp = Blueprint('hr_bp', __name__)

# ✅ Lab technician uploads lab results
@hr_bp.route('/add_lab', methods=['POST'])
@jwt_required()
def add_lab():
    usr = get_jwt_identity()
    if usr['role'] != 'lab':
        return jsonify({"error": "Unauthorized: Only lab technicians can upload"}), 403

    data = request.get_json()
    appointment_id = data.get('appointment_id')
    if not appointment_id:
        return jsonify({"error": "Missing appointment_id"}), 400

    appt = Appointment.query.get(appointment_id)
    if not appt:
        return jsonify({"error": "Invalid appointment"}), 404

    hr = HealthRecord.query.filter_by(appointment_id=appt.id).first()
    if not hr:
        hr = HealthRecord(appointment_id=appt.id, lab_technician_id=usr['id'])

    hr.lab_results = data.get('lab_results', '')
    hr.condition = data.get('condition', '')
    appt.status = 'lab done'

    db.session.add(hr)
    db.session.commit()

    return jsonify({"message": "Lab results uploaded successfully"}), 201

# ✅ Patient views their own lab results
@hr_bp.route('/patient/<int:pid>', methods=['GET'])
@jwt_required()
def health_records(pid):
    usr = get_jwt_identity()
    if usr['role'] != 'patient' or usr['id'] != pid:
        return jsonify({"error": "Unauthorized access"}), 403

    hrs = HealthRecord.query.join(Appointment).filter(Appointment.patient_id == pid).all()
    if not hrs:
        return jsonify({"message": "No lab results found"}), 200

    return jsonify([
        {
            "appointment_id": h.appointment_id,
            "lab_results": h.lab_results,
            "condition": h.condition
        } for h in hrs
    ]), 200

# ✅ Doctor views assigned lab results for a specific appointment
@hr_bp.route('/doctor/<int:appointment_id>', methods=['GET'])
@jwt_required()
def doctor_view_lab(appointment_id):
    usr = get_jwt_identity()
    if usr['role'] != 'doctor':
        return jsonify({"error": "Unauthorized: Only doctors can access this"}), 403

    appt = Appointment.query.get(appointment_id)
    if not appt:
        return jsonify({"error": "Appointment not found"}), 404
    if appt.doctor_id != usr['id']:
        return jsonify({"error": "Not authorized to view this lab record"}), 403

    hr = HealthRecord.query.filter_by(appointment_id=appointment_id).first()
    if not hr:
        return jsonify({"message": "No lab record found for this appointment"}), 404

    return jsonify({
        "appointment_id": hr.appointment_id,
        "lab_results": hr.lab_results,
        "condition": hr.condition
    }), 200

#  Admin views all lab records
@hr_bp.route('/all', methods=['GET'])
@jwt_required()
def all_lab_records():
    usr = get_jwt_identity()
    if usr['role'] != 'admin':
        return jsonify({"error": "Only admin can access this"}), 403

    hrs = HealthRecord.query.all()
    if not hrs:
        return jsonify({"message": "No lab records found"}), 200

    return jsonify([
        {
            "appointment_id": hr.appointment_id,
            "lab_technician_id": hr.lab_technician_id,
            "lab_results": hr.lab_results,
            "condition": hr.condition
        } for hr in hrs
    ]), 200
