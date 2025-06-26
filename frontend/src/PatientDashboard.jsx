import { useEffect, useState } from "react";
import BookAppointmentForm from "../components/BookAppointmentForm";


const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labResults, setLabResults] = useState([]);


  useEffect(() => {
    // Fetch from your Flask API using your token
    fetch("/api/patient/appointments")
      .then((res) => res.json())
      .then(setAppointments);


    fetch("/api/patient/records")
      .then((res) => res.json())
      .then(setRecords);


    fetch("/api/patient/prescriptions")
      .then((res) => res.json())
      .then(setPrescriptions);

    fetch("/api/patient/lab-results")
      .then((res) => res.json())
      .then(setLabResults);
  }, []);

  const handleAppointmentSubmit = (values) => {
    fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Include JWT if needed
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Appointment request sent.");
        setAppointments([...appointments, data]);
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Patient Dashboard</h1>

      <section className="mb-10">
        <BookAppointmentForm onSubmit={handleAppointmentSubmit} />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Scheduled Appointments</h2>
        <ul className="list-disc pl-6">
          {appointments.map((appt) => (
            <li key={appt.id}>
              {appt.date} at {appt.time} - {appt.status}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Health Records</h2>
        <ul className="list-disc pl-6">
          {records.map((record) => (
            <li key={record.id}>{record.description} (added: {record.date})</li>
          ))}
        </ul>
      </section>


      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Prescriptions</h2>
        <ul className="list-disc pl-6">
          {prescriptions.map((prescription) => (
            <li key={prescription.id}>
              {prescription.medicine} - {prescription.instructions}
            </li>
          ))}
        </ul>
      </section>


      <section>
        <h2 className="text-xl font-semibold mb-2">Lab Results</h2>
        <ul className="list-disc pl-6">
          {labResults.map((result) => (
            <li key={result.id}>
              {result.testName}: {result.result} ({result.date})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default PatientDashboard;
