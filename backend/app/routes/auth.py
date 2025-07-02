from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

# ✅ Login route
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
        'id': user.id,
        'username': user.username,
        'full_name': user.full_name,
        'role': user.role,
        'gender': user.gender,
        'age': user.age
    }), 200


# ✅ Register route
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
    gender = data.get('gender')
    age = data.get('age')

    # Validate required fields
    if not all([full_name, username, password, role]):
        return jsonify({'msg': 'All fields (full_name, username, password, role) are required'}), 400

    # Normalize and validate role
    role = role.lower().strip()
    valid_roles = ['admin', 'patient', 'doctor', 'labtech']
    if role not in valid_roles:
        return jsonify({'msg': f"Invalid role. Allowed roles: {', '.join(valid_roles)}"}), 400

    # Enforce password length
    if len(password) < 6:
        return jsonify({'msg': 'Password must be at least 6 characters'}), 400

    # Check if username is unique
    if User.query.filter_by(username=username).first():
        return jsonify({'msg': 'Username already exists'}), 409

    # Create user
    hashed_password = generate_password_hash(password)
    new_user = User(
        full_name=full_name,
        username=username,
        password=hashed_password,
        role=role,
        gender=gender,
        age=age
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'msg': 'User registered successfully'}), 201
