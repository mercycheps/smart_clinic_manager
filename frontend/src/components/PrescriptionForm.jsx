import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pill, PlusCircle, Search } from "lucide-react";
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const role = localStorage.getItem("userRole") || "patient";

  // Fetch prescriptions from backend
  const fetchPrescriptions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("/api/prescriptions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPrescriptions(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load prescriptions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!patientId || !medication || !dosage || !frequency) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "/api/prescriptions",
        {
          patient_id: patientId,
          medication,
          dosage,
          frequency,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccess(`Prescription created successfully! ID: ${response.data.prescription_id}`);
      setPatientId("");
      setMedication("");
      setDosage("");
      setFrequency("");
      fetchPrescriptions();
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.error || "Failed to create prescription");
    } finally {
      setLoading(false);
    }
  };

  const filtered = prescriptions.filter((p) => {
    const str = `${p.patient} ${p.medication} ${p.dosage} ${p.frequency}`.toLowerCase();
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
          {role === "doctor" ? "Doctor Portal" : role === "patient" ? "Patient Portal" : "Admin Portal"}
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
              {error && <p className="text-red-500 mt-2">{error}</p>}
              {success && <p className="text-green-500 mt-2">{success}</p>}
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
            {loading ? (
              <p>Loading...</p>
            ) : filtered.length === 0 ? (
              <p>No prescriptions found</p>
            ) : (
              filtered.map((p) => (
                <div key={p.id} className="prescription-card">
                  <h3>{p.medication}</h3>
                  <p>Patient: {p.patient} (ID: {p.patient_id})</p>
                  <p>Dosage: {p.dosage}</p>
                  <p>Frequency: {p.frequency}</p>
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