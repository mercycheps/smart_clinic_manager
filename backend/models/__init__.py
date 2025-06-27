from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


from .user import User
from .appointment import Appointment
from .health_record import HealthRecord
from .prescription import Prescription
#from .lab_technician import LabTechnician  
