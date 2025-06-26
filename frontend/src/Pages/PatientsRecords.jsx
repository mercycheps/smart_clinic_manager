import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PatientRecords = () => {
  const { patientId } = useParams(); // assume URL: /records/:patientId
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (patientId) {
      axios
        .get(`/api/patients/${patientId}/records`)
        .then((res) => {
          setRecords(Array.isArray(res.data) ? res.data : []);
        })
        .catch((err) => console.error("Error fetching records:", err));
    }
  }, [patientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`/api/patients/${patientId}/records`, newRecord)
      .then((res) => {
        setRecords((prev) => [...prev, res.data]); // append new record
        setNewRecord({ title: "", description: "" });
      })
      .catch((err) => console.error("Error saving record:", err));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Patient Records</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Record Title"
          value={newRecord.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Record Description"
          value={newRecord.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        ></textarea>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Record
        </button>
      </form>

      <div>
        {records.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <ul className="space-y-2">
            {records.map((record) => (
              <li key={record.id} className="p-3 border rounded bg-white shadow-sm">
                <h3 className="font-bold">{record.title}</h3>
                <p>{record.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PatientRecords;
