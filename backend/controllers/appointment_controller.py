from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models.appointment import Appointment
from models.user import User

appointment_bp = Blueprint('appointment_bp', __name__)

# ✅ Patient books appointment
@appointment_bp.route('/book', methods=['POST'])
@jwt_required()
def book():
    usr = get_jwt_identity()
    if usr['role'] != 'patient':
        return jsonify({"error": "Only patients can book"}), 403

    data = request.json
    appt = Appointment(
        patient_id=usr['id'],
        date=data['date'],
        time=data['time'],
        reason=data['reason']
    )
    db.session.add(appt)
    db.session.commit()
    return jsonify({"message": "Appointment booked", "id": appt.id}), 201

# ✅ Admin approves and assigns doctor
@appointment_bp.route('/approve', methods=['POST'])
@jwt_required()
def approve():
    usr = get_jwt_identity()
    if usr['role'] != 'admin':
        return jsonify({"error": "Only admin"}), 403

    data = request.json
    appt = Appointment.query.get(data['appointment_id'])
    doc = User.query.get(data['doctor_id'])

    if not appt or not doc or doc.role != 'doctor':
        return jsonify({"error": "Invalid doctor or appointment"}), 400

    appt.doctor_id = doc.id
    appt.status = 'approved'
    db.session.commit()
    return jsonify({"message": "Appointment approved"}), 200

# ✅ Admin reschedules appointment
@appointment_bp.route('/reschedule', methods=['POST'])
@jwt_required()
def reschedule():
    usr = get_jwt_identity()
    if usr['role'] != 'admin':
        return jsonify({"error": "Only admin"}), 403

    data = request.json
    appt = Appointment.query.get(data['appointment_id'])

    if not appt:
        return jsonify({"error": "Appointment not found"}), 404

    appt.date = data['new_date']
    appt.time = data['new_time']
    appt.status = 'rescheduled'
    db.session.commit()
    return jsonify({"message": "Appointment rescheduled"}), 200

# ✅ Admin views all appointments
@appointment_bp.route('/all', methods=['GET'])
@jwt_required()
def all_appointments():
    usr = get_jwt_identity()
    if usr['role'] != 'admin':
        return jsonify({"error": "Only admin"}), 403

    appts = Appointment.query.all()
    return jsonify([
        {
            "id": a.id,
            "patient_id": a.patient_id,
            "doctor_id": a.doctor_id,
            "date": a.date.isoformat(),
            "time": a.time.isoformat(),
            "status": a.status,
            "reason": a.reason
        } for a in appts
    ]), 200

# ✅ Admin views one specific appointment
@appointment_bp.route('/<int:aid>', methods=['GET'])
@jwt_required()
def get_appointment_by_id(aid):
    usr = get_jwt_identity()
    if usr['role'] != 'admin':
        return jsonify({"error": "Only admin"}), 403

    appt = Appointment.query.get(aid)
    if not appt:
        return jsonify({"error": "Appointment not found"}), 404

    return jsonify({
        "id": appt.id,
        "patient_id": appt.patient_id,
        "doctor_id": appt.doctor_id,
        "date": appt.date.isoformat(),
        "time": appt.time.isoformat(),
        "status": appt.status,
        "reason": appt.reason
    }), 200

# ✅ Patient views own appointments
@appointment_bp.route('/patient/<int:pid>', methods=['GET'])
@jwt_required()
def appointments_by_patient(pid):
    usr = get_jwt_identity()
    if usr['role'] != 'patient' or usr['id'] != pid:
        return jsonify({"error": "Unauthorized"}), 403

    appts = Appointment.query.filter_by(patient_id=pid).all()
    return jsonify([
        {
            "id": a.id,
            "date": a.date.isoformat(),
            "time": a.time.isoformat(),
            "status": a.status,
            "reason": a.reason,
            "doctor_id": a.doctor_id
        } for a in appts
    ]), 200

# ✅ Doctor views their appointments
@appointment_bp.route('/doctor/<int:did>', methods=['GET'])
@jwt_required()
def appointments_by_doctor(did):
    usr = get_jwt_identity()
    if usr['role'] != 'doctor' or usr['id'] != did:
        return jsonify({"error": "Unauthorized"}), 403

    appts = Appointment.query.filter_by(doctor_id=did).all()
    return jsonify([
        {
            "id": a.id,
            "patient_id": a.patient_id,
            "date": a.date.isoformat(),
            "time": a.time.isoformat(),
            "status": a.status,
            "reason": a.reason
        } for a in appts
    ]), 200
