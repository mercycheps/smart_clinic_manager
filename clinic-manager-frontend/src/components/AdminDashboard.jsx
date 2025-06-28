// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import './Dashboard.css';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetchUsers();
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:5000/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    setUsers(data.users || []);
  };

  const fetchDoctors = async () => {
    const res = await fetch('http://localhost:5000/admin/doctors', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    setDoctors(data.doctors || []);
  };

  const fetchAppointments = async () => {
    const res = await fetch('http://localhost:5000/patient/appointments/0', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    setAppointments(data.appointments || []);
  };

  const updateAppointment = async (id, status, doctorId = null, rescheduledDate = null) => {
    const res = await fetch(`http://localhost:5000/admin/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        status,
        doctor_id: doctorId,
        rescheduled_date: rescheduledDate
      })
    });
    const data = await res.json();
    alert(data.message);
    fetchAppointments();
  };

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>

      <section>
        <h3>Registered Users</h3>
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.full_name}</td>
                <td>{u.email}</td>
                <td>{u.phone_number}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Doctors</h3>
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Phone Number</th>
              <th>Field</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(d => (
              <tr key={d.id}>
                <td>{d.full_name}</td>
                <td>{d.phone_number}</td>
                <td>{d.field_of_medicine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Appointments</h3>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Assign Doctor</th>
              <th>Reschedule</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.id}>
                <td>{a.user_name}</td>
                <td>{a.reason}</td>
                <td>{a.status}</td>
                <td>
                  <select onChange={(e) => a.selectedDoctor = e.target.value}>
                    <option value="">Select</option>
                    {doctors
                      .filter(d => d.field_of_medicine === a.field_of_medicine)
                      .map(d => (
                        <option key={d.id} value={d.id}>{d.full_name}</option>
                      ))}
                  </select>
                </td>
                <td>
                  <input
                    type="date"
                    onChange={(e) => a.newDate = e.target.value}
                  />
                </td>
                <td>
                  <button onClick={() => updateAppointment(a.id, 'approved', a.selectedDoctor)}>Approve</button>
                  <button onClick={() => updateAppointment(a.id, 'rescheduled', null, a.newDate)}>Reschedule</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default AdminDashboard;
