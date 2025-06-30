from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import LabResult, User

from datetime import datetime

labtech_bp = Blueprint('labtech', __name__)

# ✅ View all assigned lab tests for the logged-in lab technician
@labtech_bp.route('/assigned', methods=['GET'])
@jwt_required()
def get_assigned_tests():
    identity = get_jwt_identity()
    labtech_id = identity["id"]

    results = LabResult.query.filter_by(labtech_id=labtech_id).all()
    output = []
    for r in results:
        patient = User.query.get(r.patient_id)
        output.append({
            'id': r.id,
            'patient_id': r.patient_id,
            'patient_name': patient.full_name if patient else 'Unknown',
            'test_description': r.test_description,
            'results': r.results,
            'created_at': r.created_at.isoformat() if r.created_at else None
        })

    return jsonify(output), 200

# ✅ Submit results for an assigned lab test
@labtech_bp.route('/record', methods=['POST'])
@jwt_required()
def record_lab_result():
    identity = get_jwt_identity()
    labtech_id = identity["id"]

    data = request.get_json()
    result_id = data.get('result_id')
    results = data.get('results')

    if not result_id or not results:
        return jsonify({'msg': 'Missing result_id or results'}), 400

    lab_result = LabResult.query.get(result_id)
    if not lab_result:
        return jsonify({'msg': 'Lab result not found'}), 404

    if lab_result.labtech_id != labtech_id:
        return jsonify({'msg': 'Unauthorized to update this result'}), 403

    lab_result.results = results
    lab_result.created_at = datetime.utcnow()
    db.session.commit()

    return jsonify({'msg': '✅ Lab result submitted successfully.'}), 200
