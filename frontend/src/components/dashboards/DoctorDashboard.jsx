// frontend/src/components/dashboards/DoctorDashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorDashboard = () => {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const API_URL = import.meta.env.VITE_API_URL;

  const [patients, setPatients] = useState([]);
  const [labtechs, setLabtechs] = useState([]);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    selectedPatientId: '',
    notes: '',
    prescription: '',
    labtechId: '',
    testDescription: ''
  });

  useEffect(() => {
    fetchPatients();
    fetchLabTechs();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${API_URL}/doctor/patients`, { headers });
      setPatients(res.data);
    } catch (err) {
      console.error('Error fetching patients', err);
    }
  };

  const fetchLabTechs = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/users`, { headers });
      const techs = res.data.filter(u => u.role === 'labtech');
      setLabtechs(techs);
    } catch (err) {
      console.error('Error fetching lab techs', err);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage('');
  };

  const submitHealthRecord = async () => {
    if (!form.selectedPatientId || !form.notes) {
      setMessage('❌ Patient and notes required.');
      return;
    }
    try {
      await axios.post(`${API_URL}/doctor/health-records`, {
        patient_id: form.selectedPatientId,
        notes: form.notes
      }, { headers });
      setMessage('✅ Health record created.');
      setForm(prev => ({ ...prev, notes: '' }));
    } catch (err) {
      setMessage('❌ Error creating health record.');
    }
  };

  const submitPrescription = async () => {
    if (!form.selectedPatientId || !form.prescription) {
      setMessage('❌ Patient and prescription required.');
      return;
    }
    try {
      await axios.post(`${API_URL}/doctor/prescriptions`, {
        patient_id: form.selectedPatientId,
        content: form.prescription
      }, { headers });
      setMessage('✅ Prescription sent.');
      setForm(prev => ({ ...prev, prescription: '' }));
    } catch (err) {
      setMessage('❌ Error sending prescription.');
    }
  };

  const assignLabTest = async () => {
    if (!form.selectedPatientId || !form.labtechId || !form.testDescription) {
      setMessage('❌ All fields required to assign lab test.');
      return;
    }
    try {
      await axios.post(`${API_URL}/doctor/lab-tests`, {
        patient_id: form.selectedPatientId,
        labtech_id: form.labtechId,
        test_description: form.testDescription
      }, { headers });
      setMessage('✅ Lab test assigned.');
      setForm(prev => ({ ...prev, testDescription: '', labtechId: '' }));
    } catch (err) {
      setMessage('❌ Failed to assign lab test.');
    }
  };

  return (
    <div className="container">
      <h2>Doctor Dashboard</h2>

      <label>Select Patient</label>
      <select name="selectedPatientId" onChange={handleChange} value={form.selectedPatientId}>
        <option value="">-- Select Patient --</option>
        {patients.map(p => (
          <option key={p.patient_id} value={p.patient_id}>{p.patient_name}</option>
        ))}
      </select>

      <h3>Health Record</h3>
      <textarea
        name="notes"
        placeholder="Write health notes"
        value={form.notes}
        onChange={handleChange}
      />
      <button onClick={submitHealthRecord}>Add Health Record</button>

      <h3>Prescription</h3>
      <textarea
        name="prescription"
        placeholder="Write prescription"
        value={form.prescription}
        onChange={handleChange}
      />
      <button onClick={submitPrescription}>Send Prescription</button>

      <h3>Assign Lab Test</h3>
      <select name="labtechId" value={form.labtechId} onChange={handleChange}>
        <option value="">-- Select Lab Technician --</option>
        {labtechs.map(t => (
          <option key={t.id} value={t.id}>{t.full_name}</option>
        ))}
      </select>
      <input
        type="text"
        name="testDescription"
        placeholder="Test description"
        value={form.testDescription}
        onChange={handleChange}
      />
      <button onClick={assignLabTest}>Assign Lab Test</button>

      <h3>Patient Lab Results</h3>
      {patients.map(p => (
        <div key={p.patient_id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc' }}>
          <strong>{p.patient_name}</strong>
          <ul>
            {p.lab_results.map(lr => (
              <li key={lr.id}>
                {lr.test_description} - {lr.results || 'Pending'} ({lr.created_at || 'Not Recorded'})
              </li>
            ))}
          </ul>
        </div>
      ))}

      {message && <p style={{ color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default DoctorDashboard;
