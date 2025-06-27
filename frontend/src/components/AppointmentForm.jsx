import React, { useEffect, useState } from "react";
import "./styling/appointments.css";

function Appointments() {
  const [schedule, setSchedule] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [time, setTime] = useState("");

  // Fetch appointments from the backend
  useEffect(() => {
    fetch("/api/appointments", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include JWT token
      },
    })
      .then((response) => response.json())
      .then((data) => setSchedule(data))
      .catch((err) => console.error("Failed to fetch appointments:", err));
  }, []);

  // Handle form submission to book an appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    const appointmentData = {
      appointment_date: `${selectedAppointment} ${time}`,
    };

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include JWT token
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to book appointment");
      }

      const result = await response.json();
      alert(`Appointment booked successfully! ID: ${result.appointment_id}`);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert(error.message);
    }
  };

  return (
    <div className="appointment p-6">
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="appointment" className="block font-semibold">
            Select Appointment Date:
          </label>
          <select
            id="appointment"
            name="appointment"
            className="w-full border p-2 rounded"
            value={selectedAppointment}
            onChange={(e) => setSelectedAppointment(e.target.value)}
          >
            <option value="">-- Select Appointment --</option>
            {schedule.map((appointment, index) => (
              <option key={index} value={appointment.appointment_date}>
                {appointment.appointment_date}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="time" className="block font-semibold">
            Select Time:
          </label>
          <input
            type="time"
            id="time"
            name="time"
            className="w-full border p-2 rounded"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Appointments;