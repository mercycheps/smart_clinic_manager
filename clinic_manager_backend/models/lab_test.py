from backend.models import db 


class LabTest(db.Model):
    __tablename__ = 'labtests'


    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    cost = db.Column(db.Float)


    results = db.relationship('Result', back_populates='lab_test')

    