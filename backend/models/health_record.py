from models import db

class HealthRecord(db.Model):
    __tablename__ = 'health_records'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    condition = db.Column(db.Text, nullable=False)
    recorded_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    
    patient = db.relationship('User', backref='health_records')
    
    def __repr__(self):
        return f'<HealthRecord {self.id} for Patient {self.patient_id}>'