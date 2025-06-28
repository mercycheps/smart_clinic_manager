# Register a doctor
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "drsmith",
    "password": "securepass",
    "full_name": "Dr. John Smith",
    "email": "drsmith@example.com",
    "role": "doctor",
    "field_of_medicine": "Cardiology"
  }'

# Login as doctor
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "drsmith",
    "password": "securepass"
  }'

# Get assigned patients (replace <TOKEN> and <DOCTOR_ID>)
curl -X GET http://localhost:5000/api/doctor/patients/<DOCTOR_ID> \
  -H "Authorization: Bearer <TOKEN>"

# Add a prescription for a patient (replace <TOKEN>, <PATIENT_ID>, <DOCTOR_ID>)
curl -X POST http://localhost:5000/api/doctor/prescriptions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": <PATIENT_ID>,
    "doctor_id": <DOCTOR_ID>,
    "medication": "Drug A",
    "dosage": "2x daily"
  }'
