from flask import Blueprint, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, HealthRecord, User, Appointment
import subprocess
import os

health_record_bp = Blueprint('health_record', __name__)

@health_record_bp.route('/health_records', methods=['GET'])
@jwt_required()
def get_health_records():
    identity = get_jwt_identity()
    user = User.query.filter_by(username=identity['username']).first()
    
    if identity['role'] == 'patient':
        records = HealthRecord.query.filter_by(patient_id=user.id).all()
    elif identity['role'] == 'doctor':
        appointments = Appointment.query.filter_by(doctor_id=user.id).all()
        patient_ids = {appt.patient_id for appt in appointments}
        records = HealthRecord.query.filter(HealthRecord.patient_id.in_(patient_ids)).all()
    elif identity['role'] == 'admin':
        records = HealthRecord.query.all()
    else:
        return jsonify({"error": "Invalid role"}), 403
    
    return jsonify([
        {
            'id': record.id,
            'patient': record.patient.username,
            'condition': record.condition,
            'recorded_at': record.recorded_at.isoformat()
        } for record in records
    ]), 200

@health_record_bp.route('/health_records/<int:id>/pdf', methods=['GET'])
@jwt_required()
def download_health_record_pdf(id):
    identity = get_jwt_identity()
    user = User.query.filter_by(username=identity['username']).first()
    record = HealthRecord.query.get_or_404(id)
    
    if identity['role'] == 'patient' and record.patient_id != user.id:
        return jsonify({"error": "Unauthorized access"}), 403
    
    latex_content = f"""
    \\documentclass{{article}}
    \\usepackage{{geometry}}
    \\geometry{{margin=1in}}
    \\usepackage{{noto}}
    \\begin{{document}}
    \\title{{Health Record}}
    \\author{{Smart Clinic Manager}}
    \\maketitle
    \\section{{Patient Health Record}}
    \\textbf{{Patient:}} {record.patient.username}\\\\
    \\textbf{{Condition:}} {record.condition}\\\\
    \\textbf{{Recorded At:}} {record.recorded_at.strftime('%Y-%m-%d %H:%M')}\\\\
    \\end{{document}}
    """
    
    tex_file = f"/tmp/health_record_{id}.tex"
    with open(tex_file, 'w') as f:
        f.write(latex_content)
    
    try:
        subprocess.run(['latexmk', '-pdf', tex_file], check=True, cwd='/tmp')
    except subprocess.CalledProcessError:
        return jsonify({"error": "PDF generation failed"}), 500
    
    pdf_file = f"/tmp/health_record_{id}.pdf"
    if os.path.exists(pdf_file):
        return send_file(pdf_file, as_attachment=True, download_name=f"health_record_{id}.pdf")
    
    return jsonify({"error": "PDF file not found"}), 500