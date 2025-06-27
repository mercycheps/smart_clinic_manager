from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash

from app import db
from models.user import User

# Blueprint registered at /api in app.py
user_bp = Blueprint('user_bp', __name__)

# ✅ Register a new user (POST /api/register)
@user_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    required = ['full_name', 'username', 'email', 'password', 'role']
    if not all(key in data for key in required):
        return jsonify({"error": "Missing fields"}), 400

    if User.query.filter((User.username == data['username']) | (User.email == data['email'])).first():
        return jsonify({"error": "User already exists"}), 400

    user = User(
        full_name=data['full_name'],
        username=data['username'],
        email=data['email'],
        role=data['role']
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered"}), 201

# ✅ Login user and return JWT (POST /api/login)
@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()

    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'message': 'Invalid username or password'}), 401

    access_token = create_access_token(identity={
        'id': user.id,
        'username': user.username,
        'role': user.role
    })

    return jsonify({
        'token': access_token,
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'full_name': user.full_name
    }), 200

# ✅ Admin: View all users (GET /api/users)
@user_bp.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    usr = get_jwt_identity()
    if usr['role'] != 'admin':
        return jsonify({"error": "Only admin can access all users"}), 403

    users = User.query.all()
    return jsonify([
        {
            "id": u.id,
            "full_name": u.full_name,
            "username": u.username,
            "email": u.email,
            "role": u.role
        } for u in users
    ]), 200
