from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from . import db
from .models import User
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    full_name = data.get('full_name')
    email = data.get('email')
    phone_number = data.get('phone_number')
    role = data.get('role', 'patient')
    field_of_medicine = data.get('field_of_medicine') if role == 'doctor' else None

    if not all([username, password, full_name, email]):
        return jsonify({'message': 'Missing required fields'}), 400

    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({'message': 'Username or email already exists'}), 400

    if role == 'doctor' and not field_of_medicine:
        return jsonify({'message': 'Field of medicine required for doctors'}), 400

    password_hash = generate_password_hash(password)
    new_user = User(
        username=username,
        password_hash=password_hash,
        full_name=full_name,
        email=email,
        phone_number=phone_number,
        role=role,
        field_of_medicine=field_of_medicine
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'full_name': user.full_name,
                'role': user.role
            }
        }), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({
        'id': user.id,
        'username': user.username,
        'full_name': user.full_name,
        'role': user.role
    }), 200