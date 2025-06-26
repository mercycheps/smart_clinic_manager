from app import db

class Prescription(db.Model):
    __tablename__ = 'prescription'

    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    medications = db.Column(db.Text, nullable=False)

    appointment = db.relationship('Appointment', back_populates='prescriptions')
    prescribing_doctor = db.relationship('User', back_populates='prescriptions_given', foreign_keys=[doctor_id])
    receiving_patient = db.relationship('User', back_populates='prescriptions_received', foreign_keys=[patient_id])
