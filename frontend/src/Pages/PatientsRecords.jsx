import React, { useState, useEffect } from "react";
import "../components/styling/patients.css";

const PatientsRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => {
        setPatients(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching patients:", err);
        setLoading(false);
      });
  }, []);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "active":
        return "status-active";
      case "follow-up":
        return "status-followup";
      case "inactive":
      default:
        return "status-inactive";
    }
  };

  return (
    <div className="patients-dashboard">
      <div className="stats-grid">
        {[
          { title: "Total Patients", value: "1,247", change: "+23 this month" },
          { title: "Active Patients", value: "945", change: "+12 this week" },
          { title: "New Patients", value: "23", change: "This month" },
          { title: "Follow-ups", value: "89", change: "Pending" },
        ].map((stat, index) => (
          <div key={index} className="card stat-card">
            <div className="card-content">
              <p className="stat-title">{stat.title}</p>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-change">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Patient Records</h2>
          <p className="card-description">Search and manage patient information</p>
        </div>

        <div className="card-content">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search patients by name, ID, or condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="loading-text">Loading patients...</p>
          ) : (
            <div className="patient-list">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="patient-card">
                  <div className="patient-header">
                    <div className="patient-info">
                      <h3 className="patient-name">{patient.name}</h3>
                      <span className={`badge ${getStatusClass(patient.status)}`}>
                        {patient.status}
                      </span>
                      <span className="patient-meta">
                        {patient.age} yrs, {patient.gender}
                      </span>
                    </div>
                    <div className="patient-buttons">
                      <button className="btn-outline">View Record</button>
                      <button className="btn-primary">Edit</button>
                    </div>
                  </div>

                  <div className="patient-details">
                    <div>{patient.phone}</div>
                    <div>{patient.address}</div>
                    <div>Last visit: {patient.lastVisit}</div>
                  </div>

                  <div className="patient-footer">
                    Condition: <strong>{patient.condition}</strong> | Doctor:{" "}
                    <span className="doctor-name">{patient.doctor}</span>
                  </div>

                  <div className="patient-id">
                    Patient ID: {patient.id} | Email: {patient.email}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientsRecords;
