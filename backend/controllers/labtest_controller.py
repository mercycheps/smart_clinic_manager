from flask import Blueprint, request, jsonify
from models import db, LabTest, Appointment
from flask_jwt_extended import jwt_required, get_jwt_identity

lab_bp = Blueprint('lab_bp', __name__)

@lab_bp.route('/', methods=['POST'])
@jwt_required()
def order_lab_test():
    data = request.get_json()
    current_user_identity = get_jwt_identity()

    if current_user_identity['role'] != 'doctor':
        return jsonify({'message': 'Only doctors can order lab tests'}), 403

    new_test = LabTest(
        appointment_id=data['appointment_id'],
        test_name=data['test_name'],
        lab_technician_id=data.get('lab_technician_id') # Can be assigned later
    )
    db.session.add(new_test)
    db.session.commit()
    return jsonify({'message': 'Lab test ordered successfully', 'id': new_test.id}), 201

@lab_bp.route('/<int:test_id>', methods=['PUT'])
@jwt_required()
def update_lab_test(test_id):
    data = request.get_json()
    current_user_identity = get_jwt_identity()

    if current_user_identity['role'] != 'labtech':
        return jsonify({'message': 'Only lab technicians can update tests'}), 403

    test = LabTest.query.get_or_404(test_id)
    test.result = data.get('result', test.result)
    test.status = data.get('status', test.status)
    test.lab_technician_id = current_user_identity['id']
    
    db.session.commit()
    return jsonify({'message': 'Lab test updated successfully'}), 200

@lab_bp.route('/appointment/<int:appointment_id>', methods=['GET'])
@jwt_required()
def get_tests_for_appointment(appointment_id):
    tests = LabTest.query.filter_by(appointment_id=appointment_id).all()
    output = []
    for test in tests:
        output.append({
            'id': test.id,
            'test_name': test.test_name,
            'status': test.status,
            'result': test.result
        })
    return jsonify(output), 200