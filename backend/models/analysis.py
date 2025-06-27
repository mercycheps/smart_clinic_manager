from datetime import datetime
from backend.models import db

class Analysis(db.Model):
    __tablename__ = 'analysis'

    id = db.Column(db.Integer, primary_key=True)
    result_ikd = db.Column(db.Integer, db.ForeignKey('results.id'), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    reviewed_by = db.Column(db.String(100))
    reviewed_on = db.Column(db.DateTime, default=datetime.utcnow)

    results = db.relationship('Result', back_populates='analysis')