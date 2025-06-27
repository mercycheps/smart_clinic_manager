import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styling/appointments.css";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch appointments from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("/api/appointments", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAppointments(response.data);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to load appointments. Please try again.");
      }
    };
    fetchAppointments();
  }, []);

  // Handle form submission to book an appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!appointmentDate || !time) {
      setError("Please select a date and time.");
      return;
    }

    const appointmentData = {
      appointment_date: `${appointmentDate} ${time}`,
    };

    try {
      const response = await axios.post("/api/appointments", appointmentData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSuccess(`Appointment booked successfully! ID: ${response.data.appointment_id}`);
      setAppointmentDate("");
      setTime("");
      // Refresh appointments
      const updatedResponse = await axios.get("/api/appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAppointments(updatedResponse.data);
    } catch (error) {
      console.error("Error booking appointment:", error);
      setError(error.response?.data?.error || "Failed to book appointment");
    }
  };

  return (
    <div className="appointment p-6">
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>

      {/* Display error or success messages */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {/* Book Appointment Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label htmlFor="appointmentDate" className="block font-semibold">
            Select Appointment Date:
          </label>
          <input
            type="date"
            id="appointmentDate"
            className="w-full border p-2 rounded"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]} // Prevent past dates
          />
        </div>

        <div>
          <label htmlFor="time" className="block font-semibold">
            Select Time:
          </label>
          <input
            type="time"
            id="time"
            className="w-full border p-2 rounded"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Book Appointment
        </button>
      </form>

      {/* Display Existing Appointments */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Your Appointments</h2>
        {appointments.length > 0 ? (
          <ul className="space-y-2">
            {appointments.map((appt) => (
              <li key={appt.id} className="border p-4 rounded">
                <p><strong>Date:</strong> {appt.appointment_date}</p>
                <p><strong>Status:</strong> {appt.status}</p>
                <p><strong>Doctor:</strong> {appt.doctor || "Not assigned"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No appointments found.</p>
        )}
      </div>
    </div>
  );
}

export default Appointments;