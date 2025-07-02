import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PatientDashboard = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const [formData, setFormData] = useState({ reason: '', date: '' })
  const [appointments, setAppointments] = useState([])
  const [labResults, setLabResults] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      alert('Please log in first.')
      navigate('/login')
    } else {
      fetchAppointments()
      fetchLabResults()
      fetchPrescriptions()
    }
  }, [navigate, token])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleBook = async (e) => {
    e.preventDefault()
    try {

      const res = await axios.post('http://localhost:5000/patient/book', formData, { headers })
      setMessage(res.data.msg || 'Appointment booked successfully.')
      setFormData({ reason: '', date: '' })
      fetchAppointments()

    } catch (err) {
      setMessage(err.response?.data?.msg || 'Booking failed.')
    }
  }

  const fetchAppointments = async () => {
    try {

      const res = await axios.get('http://localhost:5000/patient/appointments', { headers })
      setAppointments(res.data)

    } catch (err) {
      setMessage('Failed to load appointments.')
    }
  }

  const fetchLabResults = async () => {
    try {

      const res = await axios.get('http://localhost:5000/patient/lab-results', { headers })
      setLabResults(res.data)

    } catch (err) {
      setMessage('Failed to load lab results.')
    }
  }

  const fetchPrescriptions = async () => {
    try {

      const res = await axios.get('http://localhost:5000/patient/prescriptions', { headers })
      setPrescriptions(res.data)

    } catch (err) {
      setMessage('Failed to load prescriptions.')
    }
  }

  return (
    <div className="container">
      <h2>Patient Dashboard</h2>

      <h3>Book Appointment</h3>
      <form onSubmit={handleBook}>
        <label>Reason for Appointment</label>
        <textarea
          name="reason"
          required
          value={formData.reason}
          onChange={handleChange}
        />

        <label>Preferred Date</label>
        <input
          type="date"
          name="date"
          required
          value={formData.date}
          onChange={handleChange}
        />

        <button type="submit">Book Appointment</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      <hr />

      <h3>Your Appointments</h3>
      <button onClick={fetchAppointments}>Load Appointments</button>
      {appointments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Doctor</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.date}</td>
                <td>{appt.reason}</td>
                <td>
                  {appt.status === 'Approved' && <span style={{ color: 'green' }}>✅ Approved</span>}
                  {appt.status === 'Rejected' && <span style={{ color: 'red' }}>❌ Rejected</span>}
                  {appt.status === 'Pending' && <span style={{ color: 'orange' }}>⏳ Pending</span>}
                </td>
                <td>{appt.doctor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No appointments found.</p>
      )}

      <hr />

      <h3>Lab Results</h3>
      <button onClick={fetchLabResults}>Load Lab Results</button>
      {labResults.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Test</th>
              <th>Results</th>
              <th>Lab Technician</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {labResults.map((res) => (
              <tr key={res.id}>
                <td>{res.test_description || 'N/A'}</td>
                <td>{res.results || 'Pending'}</td>
                <td>{res.labtech}</td>
                <td>{res.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No lab results found.</p>
      )}

      <hr />

      <h3>Prescriptions</h3>
      <button onClick={fetchPrescriptions}>Load Prescriptions</button>
      {prescriptions.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Prescription</th>
              <th>Doctor</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((pres) => (
              <tr key={pres.id}>
                <td>{pres.content}</td>
                <td>{pres.doctor}</td>
                <td>{pres.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No prescriptions found.</p>
      )}
    </div>
  )
}

export default PatientDashboard
