// src/components/PatientDashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
import { parseJwt } from '../../utils/utils';
import Navbar from '../Navbar';
import './Dashboard.css';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const payload = parseJwt(token);
    if (payload) {
      setUserId(payload.sub);
      fetchData(payload.sub);
    }
  }, []);

  const fetchData = async (id) => {
    try {
      const apptRes = await API.get(`/patient/appointments/${id}`);
      const recRes = await API.get(`/patient/health-records/${id}`);
      const labRes = await API.get(`/patient/lab-results/${id}`);
      const presRes = await API.get(`/patient/prescriptions/${id}`);

      setAppointments(apptRes.data.appointments);
      setRecords(recRes.data.health_records);
      setLabResults(labRes.data.lab_results);
      setPrescriptions(presRes.data.prescriptions);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar role="patient" />
      <h2>Welcome, Patient</h2>

      <div className="dashboard-section">
        <h3>Your Appointments</h3>
        {appointments.map((a) => (
          <div key={a.id} className="card">
            <p><strong>Date:</strong> {a.date}</p>
            <p><strong>Reason:</strong> {a.reason}</p>
            <p><strong>Status:</strong> {a.status}</p>
            {a.rescheduled_date && <p><strong>Rescheduled To:</strong> {a.rescheduled_date}</p>}
            {a.doctor_name && <p><strong>Assigned Doctor:</strong> {a.doctor_name}</p>}
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <h3>Health Records</h3>
        {records.map((r) => (
          <div key={r.id} className="card">
            <p>{r.details}</p>
            <small>{r.created_at}</small>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <h3>Lab Results</h3>
        {labResults.map((r) => (
          <div key={r.id} className="card">
            <p><strong>Test:</strong> {r.test_name}</p>
            <p><strong>Result:</strong> {r.result}</p>
            <small>{r.created_at}</small>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <h3>Prescriptions</h3>
        {prescriptions.map((p) => (
          <div key={p.id} className="card">
            <p><strong>Medication:</strong> {p.medication}</p>
            <p><strong>Dosage:</strong> {p.dosage}</p>
            <small>{p.created_at}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientDashboard;
