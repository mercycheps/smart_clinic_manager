from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from models import db, User
import re
from datetime import datetime

user_bp = Blueprint('user', __name__)

# Reusable user registration function
def handle_register(email, username, password, role, fullName=None, dob=None, phone=None, address=None):
    # Validate required fields
    if not email or not username or not password or not role:
        return jsonify({"error": "Missing required fields: email, username, password, role"}), 400

    # Validate role
    if role not in ['patient', 'doctor', 'admin', 'labtech']:
        return jsonify({"error": f"Invalid role: {role}. Must be one of patient, doctor, admin, labtech"}), 400

    # Validate email format
    if not re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", email):
        return jsonify({"error": "Invalid email format"}), 400

    # Validate password length
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long"}), 400

    # Validate username length
    if len(username) < 3:
        return jsonify({"error": "Username must be at least 3 characters long"}), 400

    # Check for existing email
    if User.query.filter_by(email=email).first():
        return jsonify({"error": f"Email '{email}' is already registered"}), 400

    # Check for existing username
    if User.query.filter_by(username=username).first():
        return jsonify({"error": f"Username '{username}' already exists"}), 400

    # Validate and parse dob if provided
    parsed_dob = None
    if dob:
        try:
            parsed_dob = datetime.strptime(dob, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"error": "Invalid date of birth format. Use YYYY-MM-DD"}), 400

    # Validate phone if provided
    if phone and not re.match(r"^\+?\d{10,15}$", phone):
        return jsonify({"error": "Invalid phone number format. Use 10-15 digits, optionally starting with +"}), 400

    user = User(
        email=email,
        username=username,
        role=role,
        fullName=fullName,
        dob=parsed_dob,
        phone=phone,
        address=address
    )
    user.set_password(password)
    try:
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Database error during registration: {e}")
        return jsonify({"error": "Failed to register user due to server error"}), 500

    return jsonify({"message": f"{role.capitalize()} registered successfully", "user_id": user.id}), 201

# Route: Register patient
@user_bp.route('/patients', methods=['POST'])
def register_patient():
    print("✅ /api/patients endpoint hit")
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON payload"}), 400
    return handle_register(
        data.get('email'),
        data.get('username'),
        data.get('password'),
        role='patient',
        fullName=data.get('fullName'),
        dob=data.get('dob'),
        phone=data.get('phone'),
        address=data.get('address')
    )

# Route: Get all patients
@user_bp.route('/patients', methods=['GET'])
@jwt_required()
def get_patients():
    identity = get_jwt_identity()
    if identity['role'] not in ['admin', 'doctor']:
        return jsonify({"error": "Unauthorized: Only admins and doctors can view patients"}), 403

    try:
        patients = User.query.filter_by(role='patient').all()
        return jsonify([
            {
                'id': p.id,
                'email': p.email,
                'username': p.username,
                'role': p.role,
                'fullName': p.fullName,
                'dob': p.dob.isoformat() if p.dob else None,
                'phone': p.phone,
                'address': p.address
            } for p in patients
        ]), 200
    except Exception as e:
        print(f"Error fetching patients: {e}")
        return jsonify({"error": "Failed to fetch patients due to server error"}), 500

# Route: Register doctor
@user_bp.route('/doctors', methods=['POST'])
def register_doctor():
    print("✅ /api/doctors endpoint hit")
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON payload"}), 400
    return handle_register(
        data.get('email'),
        data.get('username'),
        data.get('password'),
        role='doctor',
        fullName=data.get('fullName'),
        phone=data.get('phone')
    )

# General registration
@user_bp.route('/register', methods=['POST'])
def register():
    print("✅ /api/register endpoint hit")
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON payload"}), 400
    return handle_register(
        data.get('email'),
        data.get('username'),
        data.get('password'),
        data.get('role'),
        data.get('fullName'),
        data.get('dob'),
        data.get('phone'),
        data.get('address')
    )

# User login
@user_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        email = data.get('email')
        password = data.get('password')
        role = data.get('role')

        if not email or not password or not role:
            return jsonify({"error": "Email, password, and role are required"}), 400

        if role not in ['patient', 'doctor', 'admin', 'labtech']:
            return jsonify({"error": f"Invalid role: {role}"}), 400

        user = User.query.filter_by(email=email, role=role).first()
        if not user or not user.check_password(password):
            return jsonify({"error": "Invalid credentials or role"}), 401

        access_token = create_access_token(identity={
            'id': user.id,
            'username': user.username,
            'role': user.role
        })

        return jsonify({
            "access_token": access_token,
            "role": user.role,
            "username": user.username,
            "user_id": user.id
        }), 200

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": "Server error during login"}), 500