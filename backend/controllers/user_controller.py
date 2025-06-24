from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User
from werkzeug.security import check_password_hash

user_bp = Blueprint('user', __name__)

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')
    
    if not username or not password or not role:
        return jsonify({"error": "Missing required fields"}), 400
    
    if role not in ['patient', 'doctor', 'admin']:
        return jsonify({"error": "Invalid role"}), 400
    
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400
    
    user = User(username=username, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully"}), 201

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401
    
    access_token = create_access_token(identity={'username': user.username, 'role': user.role})
    return jsonify({"access_token": access_token, "role": user.role}), 200

@user_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({"error": "Only admins can view users"}), 403
    
    role = request.args.get('role')
    query = User.query
    if role:
        query = query.filter_by(role=role)
    
    users = query.all()
    return jsonify([{'id': user.id, 'username': user.username, 'role': user.role} for user in users]), 200