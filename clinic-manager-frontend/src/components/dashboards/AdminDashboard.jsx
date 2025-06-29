// AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState('');
  const [actions, setActions] = useState({});

  useEffect(() => {
    fetchUsers();
    fetchAppointments();
  }, []);

  const fetchUsers = async () => {

    const res = await axios.get('http://localhost:5000/admin/users', { headers });
    setUsers(res.data);
    setDoctors(res.data.filter(u => u.role === 'doctor'));
  };

  const fetchAppointments = async () => {
    const res = await axios.get('http://localhost:5000/admin/appointments', { headers });
    setAppointments(res.data);
  };


  const handleChange = (appointmentId, key, value) => {
    setActions(prev => ({
      ...prev,
      [appointmentId]: {
        ...prev[appointmentId],
        [key]: value
      }
    }));
  };

  const handleSubmit = async (appointmentId) => {
    const action = actions[appointmentId];

    if (!action || !action.status) return setMessage('Choose approve/reject.');
    if (action.status === 'Approved' && !action.doctorId)
      return setMessage('Select doctor to approve.');

    await axios.post('http://localhost:5000/admin/approve', {
      appointment_id: appointmentId,
      status: action.status,
      doctor_id: action.status === 'Approved' ? action.doctorId : null
    }, { headers });


    setMessage(`Appointment ${action.status.toLowerCase()} successfully.`);
    fetchAppointments();
    setActions(prev => ({ ...prev, [appointmentId]: {} }));
  };


  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      <h3>Registered Users</h3>
      <table>
        <thead><tr><th>Name</th><th>Username</th><th>Role</th></tr></thead>
        <tbody>
          {users.map(u => <tr key={u.id}><td>{u.full_name}</td><td>{u.username}</td><td>{u.role}</td></tr>)}
        </tbody>
      </table>

      <h3>Appointments</h3>
      <table>
        <thead><tr><th>Date</th><th>Patient</th><th>Reason</th><th>Status</th><th>Doctor</th><th>Actions</th></tr></thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a.id}>
              <td>{a.date}</td>
              <td>{a.patient_name}</td>
              <td>{a.reason}</td>
              <td>{a.status}</td>
              <td>{a.doctor_name || 'None'}</td>
              <td>
                {a.status === 'Pending' ? (
                  <>
                    <select value={actions[a.id]?.doctorId || ''} onChange={e => handleChange(a.id, 'doctorId', e.target.value)}>
                      <option value=''>Select Doctor</option>
                      {doctors.map(doc => <option key={doc.id} value={doc.id}>{doc.full_name}</option>)}
                    </select>
                    <button onClick={() => handleChange(a.id, 'status', 'Approved')}>Approve</button>
                    <button onClick={() => handleChange(a.id, 'status', 'Rejected')}>Reject</button>
                    <button onClick={() => handleSubmit(a.id)}>Make Changes</button>
                  </>
                ) : 'Done'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default AdminDashboard;
