# smart_clinic_manager
🏥 Smart Clinic Manager
Smart Clinic Manager is a comprehensive, full-stack healthcare management system designed to streamline operations in clinics and small hospitals. It supports multiple user roles including doctors, patients, lab technicians, and administrators. The platform enables efficient patient record management, real-time appointment scheduling, prescription handling, lab result tracking, and secure communication between stakeholders.

🚀 Features
🔐 Secure Authentication (JWT-based)

👩‍⚕️ Role-based Dashboards for Doctors, Patients, Lab Technicians, and Admins

📅 Real-time Appointment Booking & Management

💊 E-prescriptions with editable prescriptions for doctors

🧪 Lab Requests and Result Review by lab technicians and doctors

📁 Health Records Management with PDF export

📲 SMS/Email Alerts (via integrations like Twilio/Gmail API)

📊 Doctor Analytics Dashboard (Patients seen, pending labs, recent activity)

🌐 Responsive Web Interface built with React

⚙️ Backend REST API with Flask and PostgreSQL

🧰 Tech Stack
🔧 Backend
Python 3.10+

Flask

Flask-JWT-Extended

SQLAlchemy (ORM)

Flask-Migrate (Database migrations)

PostgreSQL

🎨 Frontend
React.js

React Router

Axios

Plain CSS (or Tailwind if enabled)

React Hook Form

🏗️ Project Structure
📂 Backend
arduino
Copy
Edit
clinic_manager_backend/
├── app/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── utils/
│   └── __init__.py
├── config.py
├── manage.py
└── requirements.txt
📂 Frontend
java
Copy
Edit
smart_clinic_manager_frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── api/
│   └── App.jsx
├── public/
└── package.json
🛠️ Setup Instructions
⚙️ Backend
Clone the repo:

bash
Copy
Edit
git clone https://github.com/yourusername/smart-clinic-manager.git
cd smart-clinic-manager/clinic_manager_backend
Create and activate virtual environment:

bash
Copy
Edit
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies:

bash
Copy
Edit
pip install -r requirements.txt
Setup PostgreSQL and .env:

ini
Copy
Edit
FLASK_APP=app
FLASK_ENV=development
SECRET_KEY=your_secret_key
DATABASE_URL=postgresql://user:password@localhost/clinicdb
Initialize database:

bash
Copy
Edit
flask db init
flask db migrate
flask db upgrade
Run the API:

bash
Copy
Edit
flask run
🖥️ Frontend
Navigate to frontend:

bash
Copy
Edit
cd ../smart_clinic_manager_frontend
Install dependencies:

bash
Copy
Edit
npm install
Create .env:

ini
Copy
Edit
VITE_API_BASE_URL=http://127.0.0.1:5000
Run the React app:

bash
Copy
Edit
npm run dev
📸 Screenshots
Include screenshots of:

Patient Dashboard

Doctor Dashboard

Appointment Booking Page

Lab Results Interface

👥 User Roles
👨‍⚕️ Doctor
View today’s appointments

Write and edit prescriptions

Review lab results

Manage medical records

👤 Patient
Book and view appointments

See prescriptions and records

Receive alerts and messages

🧪 Lab Technician
View lab requests

Upload lab results

🛡️ Admin
Manage users (doctors, patients, labs)

View appointment stats

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙌 Acknowledgements
Titus Kiprono
Collins Muriuki
Mercy Chebet
Dennis Muchiri

Special thanks to Flask, React, PostgreSQL, and the open-source community.# smart_clinic_manager   