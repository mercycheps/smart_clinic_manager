// src/components/DoctorDashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
import { parseJwt } from '../../utils/utils';
import Navbar from '../Navbar';
import './Dashboard.css';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');

  const token = localStorage.getItem('token');
  const payload = parseJwt(token);
  const doctorId = payload?.sub;

  useEffect(() => {
    if (doctorId) {
      fetchPatients();
    }
  }, [doctorId]);

  const fetchPatients = async () => {
    try {
      const res = await API.get(`/doctor/patients/${doctorId}`);
      setPatients(res.data.patients);
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    }
  };

  const loadPatientDetails = async (id) => {
    setSelectedPatient(id);
    try {
      const recRes = await API.get(`/patient/health-records/${id}`);
      const labRes = await API.get(`/patient/lab-results/${id}`);
      setHealthRecords(recRes.data.health_records);
      setLabResults(labRes.data.lab_results);
    } catch (err) {
      console.error('Failed to fetch patient details:', err);
    }
  };

  const handlePrescriptionSubmit = async () => {
    if (!selectedPatient || !medication || !dosage) return;
    try {
      await API.post('/doctor/prescriptions', {
        user_id: selectedPatient,
        medication,
        dosage
      });
      alert('Prescription submitted successfully');
      setMedication('');
      setDosage('');
    } catch (err) {
      console.error('Failed to submit prescription:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar role="doctor" />
      <h2>Welcome, Doctor</h2>

      <div className="dashboard-section">
        <h3>Assigned Patients</h3>
        {patients.map((p) => (
          <div key={p.id} className="card" onClick={() => loadPatientDetails(p.id)}>
            <p>{p.full_name}</p>
            <p><strong>Date:</strong> {p.date}</p>
            <p><strong>Reason:</strong> {p.reason}</p>
          </div>
        ))}
      </div>

      {selectedPatient && (
        <div className="dashboard-section">
          <h3>Health Records</h3>
          {healthRecords.map((r) => (
            <div key={r.id} className="card">
              <p>{r.details}</p>
              <small>{r.created_at}</small>
            </div>
          ))}

          <h3>Lab Results</h3>
          {labResults.map((l) => (
            <div key={l.id} className="card">
              <p><strong>Test:</strong> {l.test_name}</p>
              <p><strong>Result:</strong> {l.result}</p>
              <small>{l.created_at}</small>
            </div>
          ))}

          <h3>Give Prescription</h3>
          <input
            type="text"
            placeholder="Medication"
            value={medication}
            onChange={(e) => setMedication(e.target.value)}
          />
          <input
            type="text"
            placeholder="Dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
          />
          <button onClick={handlePrescriptionSubmit}>Submit Prescription</button>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
