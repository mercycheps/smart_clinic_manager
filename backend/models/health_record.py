from app import db

class HealthRecord(db.Model):
    __tablename__ = 'health_record'

    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=False, unique=True)
    lab_technician_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    lab_results = db.Column(db.Text)
    condition = db.Column(db.Text)

    appointment = db.relationship('Appointment', back_populates='health_record')
    lab_technician = db.relationship('User', back_populates='lab_health_records', foreign_keys=[lab_technician_id])
