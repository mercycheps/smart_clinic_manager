import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar"
import "../components/styling/doctor.css";
const Doctor = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [labResults, setLabRequests] = useState([]);
  const [patientCount, setPatientCount] = useState(0);

  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => {
        setPatients(data);
        setPatientCount(data.length);
      })
      .catch((err) => console.error("Error fetching patients:", err));
  }, []);

  const patientClick = (patientId) => {
    fetch(`/api/patients/${patientId}/details`)
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data.appointments || []);
        setRecords(data.records || []);
        setLabRequests(data.labResults || []);
      });
  };

  const AppointmentsClick = () => {
    fetch("/api/appointments")
      .then((res) => res.json())
      .then((data) => setAppointments(data));
  };

  const RecordsClick = () => {
    fetch("/api/records")
      .then((res) => res.json())
      .then((data) => setRecords(data));
  };

  const LabResultsClick = () => {
    fetch("/api/lab-results")
      .then((res) => res.json())
      .then((data) => setLabRequests(data));
  };

  return (
    <div className="doctor-container">
      <Navbar />
      <div className="doctor-dashboard">
        <h1 className="dashboard-title">Doctor Dashboard</h1>

        {/* Grid of Action Buttons */}
        <div className="action-buttons">
          <button className="action-button" onClick={AppointmentsClick}>
            Load Appointments
          </button>
          <button className="action-button" onClick={RecordsClick}>
            Load Records
          </button>
          <button className="action-button" onClick={LabResultsClick}>
            Load Lab Results
          </button>
        </div>

        {/* Today's Patients */}
        <div className="card">
          <div className="card-header">
            <h2>Today's Patients ({patientCount})</h2>
          </div>
          <div className="card-body">
            <ul className="list">
              {patients.map((patient) => (
                <li
                  key={patient.id}
                  className="list-item"
                  onClick={() => patientClick(patient.id)}
                >
                  {patient.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Appointments */}
        <div className="card">
          <div className="card-header">
            <h2>Appointments</h2>
          </div>
          <div className="card-body">
            {appointments.length === 0 ? (
              <p className="empty-message">Click "Load Appointments" to view appointments</p>
            ) : (
              <ul className="list">
                {appointments.map((appointment) => (
                  <li key={appointment.id} className="list-item">
                    {appointment.patientName} at {appointment.time}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Records */}
        <div className="card">
          <div className="card-header">
            <h2>Medical Records</h2>
          </div>
          <div className="card-body">
            {records.length === 0 ? (
              <p className="empty-message">Click "Load Records" to view medical records</p>
            ) : (
              <ul className="list">
                {records.map((record) => (
                  <li key={record.id} className="list-item">
                    {record.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Lab Results */}
        <div className="card">
          <div className="card-header">
            <h2>Lab Results</h2>
          </div>
          <div className="card-body">
            {labResults.length === 0 ? (
              <p className="empty-message">Click "Load Lab Results" to view lab results</p>
            ) : (
              <ul className="list">
                {labResults.map((lab) => (
                  <li key={lab.id} className="list-item">
                    {lab.testtype} - {lab.status}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctor;