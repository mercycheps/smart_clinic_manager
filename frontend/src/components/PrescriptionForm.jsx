import React, { useState, useEffect } from "react";
import { Pill, PlusCircle, User, Calendar, Search } from "lucide-react";
import "./prescriptions.css";

const PrescriptionManager = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("doctor"); // Assume role, replace with auth logic.

  // Fetch prescriptions from backend
  const fetchPrescriptions = () => {
    fetch("/prescriptions", {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setPrescriptions(data))
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!patientId || !medication || !dosage || !frequency) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    fetch("/prescriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        patient_id: patientId,
        medication: `${medication};${dosage};${frequency}`,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create");
        return res.json();
      })
      .then(() => {
        setLoading(false);
        setPatientId("");
        setMedication("");
        setDosage("");
        setFrequency("");
        fetchPrescriptions();
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  };

  const filtered = prescriptions.filter((p) => {
    const str = `${p.patient} ${p.medication}`.toLowerCase();
    const matchSearch = str.includes(searchTerm.toLowerCase());
    const matchFilter = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchFilter;
  });

  return (
    <div className="prescription-container">
      <header className="prescription-header">
        <div className="header-left">
          <Pill size={32} />
          <div>
            <h1>Prescription Manager</h1>
            <p>Digital Healthcare Management System</p>
          </div>
        </div>
        <span className="role-badge">
          {role === "doctor" ? "Doctor Portal" : "Patient Portal"}
        </span>
      </header>

      <main className="prescription-main">
        {role === "doctor" && (
          <section className="prescription-form">
            <div className="form-header">
              <PlusCircle size={20} />
              <h2>New Prescription</h2>
            </div>
            <form onSubmit={handleCreate}>
              <label>Patient ID</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
              />
              <label>Medication</label>
              <input
                type="text"
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
                required
              />
              <label>Dosage</label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                required
              />
              <label>Frequency</label>
              <input
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Prescription"}
              </button>
            </form>
          </section>
        )}

        <section className="prescription-list">
          <div className="filter-bar">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search prescriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div className="prescription-items">
            {filtered.length === 0 ? (
              <p>No prescriptions found</p>
            ) : (
              filtered.map((p) => (
                <div key={p.id} className="prescription-card">
                  <h3>{p.medication}</h3>
                  <p>Patient: {p.patient} (ID: {p.patient_id})</p>
                  <p>Date: {new Date(p.prescribed_at).toLocaleDateString()}</p>
                  <p>Status: <span className={`badge ${p.status}`}>{p.status}</span></p>
                  <p>Doctor: {p.doctor}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PrescriptionManager;
