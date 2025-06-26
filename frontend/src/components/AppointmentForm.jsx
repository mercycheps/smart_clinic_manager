import React, { useEffect, useState } from "react";

function Appointments() {
  const [schedule, setSchedule] = useState([]);
  const [time, setTime] = useState("");

  useEffect(() => {
    fetch("/api/appointments")
      .then((response) => response.json())
      .then((data) => setSchedule(data))
      .catch((err) => console.error("Failed to fetch appointments:", err));
  }, []);

  useEffect(() => {
    fetch("/api/appointments/time")
      .then((response) => response.json())
      .then((data) => setTime(data.time || ""))
      .catch((err) => console.error("Failed to fetch time:", err));
  }, []);

  return (
    <div className="appointment p-6">
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>
      <form className="space-y-4">
        <div>
          <label htmlFor="appointment" className="block font-semibold">Select Appointment:</label>
          <select
            id="appointment"
            name="appointment"
            className="w-full border p-2 rounded"
          >
            {schedule.map((appointment, index) => (
              <option key={index} value={appointment.id}>
                {appointment.date} - {appointment.time}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="time" className="block font-semibold">Select Time:</label>
          <input
            type="time"
            id="time"
            name="time"
            className="w-full border p-2 rounded"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Appointments;
