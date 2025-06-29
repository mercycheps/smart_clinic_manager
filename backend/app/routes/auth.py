from flask import Blueprint, request, jsonify
from backend.app.extensions import db
from backend.app.models.models import User
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'msg': 'Missing JSON body'}), 400

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'msg': 'Username and password required'}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'msg': 'Invalid credentials'}), 401

    access_token = create_access_token(
        identity={'id': user.id, 'role': user.role},
        expires_delta=timedelta(days=1)
    )

    return jsonify({
        'access_token': access_token,
        'role': user.role,
        'id': user.id,
        'full_name': user.full_name
    }), 200


@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 200  # CORS preflight

    data = request.get_json()
    if not data:
        return jsonify({'msg': 'Missing JSON body'}), 400

    full_name = data.get('full_name')
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if not all([full_name, username, password, role]):
        return jsonify({'msg': 'All fields (full_name, username, password, role) are required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'msg': 'Username already exists'}), 409

    hashed_password = generate_password_hash(password)
    new_user = User(
        full_name=full_name,
        username=username,
        password=hashed_password,
        role=role
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'msg': 'User registered successfully'}), 201
