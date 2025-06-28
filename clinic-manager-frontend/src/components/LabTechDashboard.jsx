// src/components/LabTechDashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
import { parseJwt } from '../../utils/utils';
import Navbar from '../Navbar';
import './Dashboard.css';

const LabTechDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [testName, setTestName] = useState('');
  const [result, setResult] = useState('');

  const token = localStorage.getItem('token');
  const payload = parseJwt(token);
  const labTechId = payload?.sub;

  useEffect(() => {
    if (labTechId) {
      fetchPatients();
    }
  }, [labTechId]);

  const fetchPatients = async () => {
    try {
      const res = await API.get(`/labtech/patients/${labTechId}`);
      setPatients(res.data.patients);
    } catch (err) {
      console.error('Failed to fetch lab patients:', err);
    }
  };

  const submitLabResult = async () => {
    if (!selectedPatientId || !testName || !result) return;
    try {
      await API.post('/labtech/lab-results', {
        user_id: selectedPatientId,
        test_name: testName,
        result
      });
      alert('Lab result submitted successfully');
      setTestName('');
      setResult('');
    } catch (err) {
      console.error('Failed to submit lab result:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar role="labtech" />
      <h2>Welcome, Lab Technician</h2>

      <div className="dashboard-section">
        <h3>Assigned Patients</h3>
        {patients.map((p) => (
          <div
            key={p.id}
            className={`card ${selectedPatientId === p.id ? 'selected' : ''}`}
            onClick={() => setSelectedPatientId(p.id)}
          >
            <p>{p.full_name}</p>
            <small>Status: {p.test_required}</small>
          </div>
        ))}
      </div>

      {selectedPatientId && (
        <div className="dashboard-section">
          <h3>Append Lab Result</h3>
          <input
            type="text"
            placeholder="Test Name"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Result"
            value={result}
            onChange={(e) => setResult(e.target.value)}
          />
          <button onClick={submitLabResult}>Submit Result</button>
        </div>
      )}
    </div>
  );
};

export default LabTechDashboard;
