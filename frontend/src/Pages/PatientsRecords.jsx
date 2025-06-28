import React, { useState, useEffect } from "react";
import "../components/styling/patients.css";

const PatientsRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/health_records", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch health records");
        return res.json();
      })
      .then((data) => {
        const mappedPatients = data.map((record) => ({
          id: record.id,
          name: record.patient || "Unknown",
          age: "N/A", // Optional: add a backend field or fetch from user data
          gender: "N/A",
          phone: "N/A",
          email: "N/A",
          address: "N/A",
          lastVisit: record.recorded_at,
          condition: record.condition,
          status: "active", // Could vary based on logic
          doctor: "Assigned Doctor",
        }));
        setPatients(mappedPatients);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      {/* Stats Cards */}
      <div className="stats-grid">
        {[
          { title: "Total Patients", value: patients.length.toString(), change: "+23 this month" },
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

      {/* Patient Records Section */}
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
                      <span className={`badge ${getStatusClass(patient.status)}`}>{patient.status}</span>
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
                    <div>Last visit: {new Date(patient.lastVisit).toLocaleString()}</div>
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
