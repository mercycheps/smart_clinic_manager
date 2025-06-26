from models import db

class Prescription(db.Model):
    __tablename__ = 'prescriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    medication = db.Column(db.Text, nullable=False)
    prescribed_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    
    patient = db.relationship('User', foreign_keys=[patient_id], backref='prescriptions_as_patient')
    doctor = db.relationship('User', foreign_keys=[doctor_id], backref='prescriptions_as_doctor')
    
    def __repr__(self):
        return f'<Prescription {self.id} for Patient {self.patient_id} by Doctor {self.doctor_id}>'