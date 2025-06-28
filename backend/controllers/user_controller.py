from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import db, User
from werkzeug.security import check_password_hash
import logging

user_bp = Blueprint('user', __name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    logger.info(f"Registering user: email={data.get('email')}, username={data.get('username')}, role={data.get('role')}")

    # Common required fields
    required_fields = ['email', 'username', 'password', 'role']
    if not all(data.get(field) for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Validate role
    valid_roles = ['patient', 'doctor', 'labtech', 'admin']
    if data['role'] not in valid_roles:
        return jsonify({"error": "Invalid role"}), 400

    # Role-specific required fields
    if data['role'] == 'doctor':
        if not data.get('licenseNumber') or not data.get('specialization'):
            return jsonify({"error": "Doctors must provide licenseNumber and specialization"}), 400
    elif data['role'] == 'labtech':
        if not data.get('certificationId'):
            return jsonify({"error": "Lab technicians must provide certificationId"}), 400
    elif data['role'] == 'patient':
        if not data.get('fullName'):
            return jsonify({"error": "Patients must provide fullName"}), 400

    # Check for existing email or username
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 400
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already taken"}), 400

    # Create new user
    user = User(
        email=data['email'],
        username=data['username'],
        role=data['role'],
        fullName=data.get('fullName'),
        dob=data.get('dob'),
        phone=data.get('phone'),
        address=data.get('address'),
        licenseNumber=data.get('licenseNumber'),
        specialization=data.get('specialization'),
        certificationId=data.get('certificationId')
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": f"{data['role'].capitalize()} registered successfully", "user_id": user.id}), 201

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    logger.info(f"Login attempt: email={data.get('email')}, role={data.get('role')}")

    if not data or not data.get('email') or not data.get('password') or not data.get('role'):
        return jsonify({"error": "Email, password, and role are required"}), 400

    user = User.query.filter_by(email=data['email'], role=data['role']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Invalid credentials or role"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({
        "access_token": access_token,
        "role": user.role,
        "username": user.username,
        "user_id": user.id
    }), 200