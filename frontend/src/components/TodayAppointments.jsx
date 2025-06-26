import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styling/appointments.css"; 

const TodayAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const res = await axios.get(`/api/appointments?date=${today}`);

        // Defensive check to ensure it's an array
        const data = res.data;
        setAppointments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching today's appointments", error);
        setAppointments([]); // fallback
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="today-appointments-container">
      <h2 className="today-appointments-title">Today's Appointments</h2>
      {appointments.length === 0 ? (
        <p className="today-appointments-empty">No appointments for today.</p>
      ) : (
        <ul className="today-appointments-list">
          {appointments.map((appt) => (
            <li key={appt.id} className="today-appointments-item">
              <strong>{appt.patientName}</strong> — {appt.time}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodayAppointments;