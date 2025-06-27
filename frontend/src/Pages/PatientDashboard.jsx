import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../components/styling/patients.css";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'appointments') {
          const response = await axios.get('/api/appointments', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setAppointments(response.data);
        } else if (activeTab === 'records') {
          const response = await axios.get('/api/health-records', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setRecords(response.data);
        } else if (activeTab === 'prescriptions') {
          const response = await axios.get('/api/prescriptions', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setPrescriptions(response.data);
        }
      } catch (error) {
        console.error(`Failed to fetch ${activeTab}:`, error);
      }
    };

    fetchData();
  }, [activeTab]);

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'appointments':
        return (
          <div>
            <h2 className="section-title">Appointments</h2>
            <Link to="/book-appointment" className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">
              Book New Appointment
            </Link>
            {appointments.length > 0 ? (
              <ul className="list">
                {appointments.map((appointment) => (
                  <li key={appointment.id} className="list-item">
                    <p><strong>Date:</strong> {appointment.appointment_date}</p>
                    <p><strong>Status:</strong> {appointment.status}</p>
                    <p><strong>Doctor:</strong> {appointment.doctor || "Not assigned"}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No appointments found.</p>
            )}
          </div>
        );
      case 'records':
        return (
          <div>
            <h2 className="section-title">Medical Records</h2>
            {records.length > 0 ? (
              <ul className="list">
                {records.map((record) => (
                  <li key={record.id} className="list-item">
                    <p><strong>Condition:</strong> {record.condition}</p>
                    <p><strong>Date:</strong> {record.date}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No medical records found.</p>
            )}
          </div>
        );
      case 'prescriptions':
        return (
          <div>
            <h2 className="section-title">Prescriptions</h2>
            <Link to="/prescriptions" className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">
              Manage Prescriptions
            </Link>
            {prescriptions.length > 0 ? (
              <ul className="list">
                {prescriptions.map((prescription) => (
                  <li key={prescription.id} className="list-item">
                    <p><strong>Medication:</strong> {prescription.medication}</p>
                    <p><strong>Dosage:</strong> {prescription.dosage}</p>
                    <p><strong>Frequency:</strong> {prescription.frequency}</p>
                    <p><strong>Status:</strong> {prescription.status}</p>
                    <p><strong>Prescribed At:</strong> {new Date(prescription.prescribed_at).toLocaleDateString()}</p>
                    <p><strong>Doctor:</strong> {prescription.doctor}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No prescriptions found.</p>
            )}
          </div>
        );
      default:
        return <p>Select a tab to view details.</p>;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="user-icon">👤</div>
            <div>
              <h1 className="header-title">Patient Portal</h1>
              <p className="header-subtitle">Welcome back, {localStorage.getItem("userRole") || "User"}</p>
            </div>
          </div>
          <div className="header-right">
            <button className="header-button">🔔 Notifications</button>
            <button className="header-button">🚪 Logout</button>
          </div>
        </div>
      </header>

      <div className="main-content">
        <nav className="tabs">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`tab-button ${activeTab === 'appointments' ? 'active' : ''}`}
          >
            📅 Appointments
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`tab-button ${activeTab === 'records' ? 'active' : ''}`}
          >
            📄 Medical Records
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`tab-button ${activeTab === 'prescriptions' ? 'active' : ''}`}
          >
            💊 Prescriptions
          </button>
        </nav>

        <div className="section">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;