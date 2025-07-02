from app.extensions import db
from datetime import datetime

class LabResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    labtech_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    test_description = db.Column(db.Text, nullable=True)
    results = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
