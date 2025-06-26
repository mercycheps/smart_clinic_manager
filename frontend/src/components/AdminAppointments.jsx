import React, { useState } from "react";

const AdminAppointmentForm = ({ onBook }) => {
  const [formData, setFormData] = useState({
    patientName: "",
    date: "",
    time: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Appointment booked!");
        if (onBook) onBook(); // Notify parent (e.g., AdminDashboard)
      })
      .catch((err) => console.error("Booking error:", err));
  };

  return (
    <div className="form-container">
      <h2>Book Appointment</h2>
      <form onSubmit={handleSubmit}>
        <label>Patient Name:</label>
        <input
          type="text"
          name="patientName"
          value={formData.patientName}
          onChange={handleChange}
          required
        />
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <label>Time:</label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default AdminAppointmentForm;
