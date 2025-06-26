import React, { useState, useEffect } from "react";
import "../components/styling/appointments.css";

const AdminAppointments = ({ onBook }) => {
  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    date: "",
    time: "",
    type: "",
  });
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch("/api/appointments/today")
      .then(res => res.json())
      .then(data => setAppointments(data))
      .catch(err => console.error("Failed to fetch appointments:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking appointment:", formData);
    // Normally send to backend here
    onBook?.();
    setFormData({ patientName: "", doctorName: "", date: "", time: "", type: "" });
  };

  return (
    <div className="appointments-container">
      {/* Booking Form */}
      <div className="card">
        <div className="card-header">
          <h3>Book New Appointment</h3>
          <p>Schedule a new patient appointment</p>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="form">
            <label>Patient Name</label>
            <input
              type="text"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              required
            />

            <label>Doctor</label>
            <select
              value={formData.doctorName}
              onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
              required
            >
              <option value="">Select a doctor</option>
              <option value="Dr. Sarah Wilson">Dr. Sarah Wilson</option>
              <option value="Dr. Michael Chen">Dr. Michael Chen</option>
              <option value="Dr. Emily Rodriguez">Dr. Emily Rodriguez</option>
              <option value="Dr. James Thompson">Dr. James Thompson</option>
            </select>

            <div className="row">
              <div>
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>

            <label>Appointment Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            >
              <option value="">Select appointment type</option>
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="check-up">Check-up</option>
              <option value="emergency">Emergency</option>
            </select>

            <button type="submit" className="primary-btn">Book Appointment</button>
          </form>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="card">
        <div className="card-header">
          <h3>Today's Appointments</h3>
          <p>Scheduled appointments for today</p>
        </div>
        <div className="card-body appointments-list">
          {appointments.length === 0 ? (
            <p className="muted">No appointments scheduled.</p>
          ) : (
            appointments.map((appt) => (
              <div key={appt.id} className="appointment">
                <div>
                  <strong>{appt.patient}</strong>
                  <p>{appt.doctor}</p>
                  <span>{appt.type}</span>
                </div>
                <div className="appointment-time">{appt.time}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
