# utils.py

from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from functools import wraps
from datetime import datetime

# ---- Role Check Decorator ----
def role_required(required_role):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            identity = get_jwt_identity()
            if identity.get('role') != required_role:
                return jsonify({'msg': 'Unauthorized: Requires {} access'.format(required_role)}), 403
            return func(*args, **kwargs)
        return wrapper
    return decorator

# ---- Allowed Roles Check ----
def roles_required(*roles):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            identity = get_jwt_identity()
            if identity.get('role') not in roles:
                return jsonify({'msg': 'Unauthorized: Requires one of {}'.format(roles)}), 403
            return func(*args, **kwargs)
        return wrapper
    return decorator

# ---- Format datetime safely ----
def format_date(dt):
    return dt.strftime('%Y-%m-%d') if dt else None

# ---- Validate registration data ----
def validate_registration_data(data):
    required_fields = ['username', 'password', 'full_name', 'role']
    missing = [field for field in required_fields if not data.get(field)]
    if missing:
        return False, f"Missing fields: {', '.join(missing)}"
    if data.get('role') not in ['admin', 'doctor', 'patient', 'labtech']:
        return False, "Invalid role"
    return True, None

# ---- Check if a string is a valid date ----
def is_valid_date(date_str, format="%Y-%m-%d"):
    try:
        datetime.strptime(date_str, format)
        return True
    except ValueError:
        return False

# ---- Parse identity ----
def get_user_identity():
    identity = get_jwt_identity()
    return identity.get('id'), identity.get('role')
