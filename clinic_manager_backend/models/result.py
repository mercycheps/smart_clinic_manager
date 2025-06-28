from datetime import datetime
from backend.models import db


class Result(db.Model):
    __tablename__ = 'results'

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    lab_test_id = db.Column(db.Integer, db.ForeignKey('labtests.id'), nullable=False)
    collected_date = db.Column(db.DateTime, default=datetime.utcnow)
    result_value = db.Column(db.String(100))
    status = db.Column(db.String(50), default='pending')


    patient = db.relationship('User', back_populates='results')
    lab_test = db.relationship('LabTest', back_populates='results')
    analysis = db.relationship('Analysis', back_populates='results', uselist=False)
