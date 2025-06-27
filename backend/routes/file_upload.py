from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from backend.app import app, allowed_file  # adjust import paths as needed

file_upload_bp = Blueprint('file_upload', __name__)

@file_upload_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        return jsonify({'message': 'File uploaded successfully', 'filename': filename}), 201
    else:
        return jsonify({'error': 'Invalid file type'}), 400
