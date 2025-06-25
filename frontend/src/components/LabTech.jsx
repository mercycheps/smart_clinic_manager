import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import "../components/styling/lab.css";

const mockLabRequests = [
  { id: 1, patientName: 'John Doe', testType: 'Blood Test', status: 'Pending' },
  { id: 2, patientName: 'Jane Smith', testType: 'Urine Test', status: 'Pending' },
];

const LabTech = () => {
  const [labRequests, setLabRequests] = useState(mockLabRequests);
  const [results, setResults] = useState({});

  const handleInputChange = (id, value) => {
    setResults((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitResult = (id) => {
    const updatedRequests = labRequests.map((req) =>
      req.id === id
        ? { ...req, result: results[id], status: 'Completed' }
        : req
    );
    setLabRequests(updatedRequests);
    alert(`Results for patient ID ${id} submitted.`);
  };

  return (
    <>
      <Navbar />
      <div className="labtech-container">
        <h2 className="labtech-title">Lab Technician Panel</h2>

        {labRequests.length === 0 ? (
          <p className="labtech-empty">No lab requests.</p>
        ) : (
          <div className="labtech-requests">
            {labRequests.map((request) => (
              <div key={request.id} className="labtech-request">
                <p><strong>Patient:</strong> {request.patientName}</p>
                <p><strong>Test Type:</strong> {request.testType}</p>
                <p><strong>Status:</strong> {request.status}</p>

                {request.status === 'Pending' && (
                  <div className="labtech-actions">
                    <textarea
                      rows={3}
                      placeholder="Enter test results..."
                      className="labtech-textarea"
                      value={results[request.id] || ''}
                      onChange={(e) => handleInputChange(request.id, e.target.value)}
                    />
                    <button
                      className="labtech-submit-button"
                      onClick={() => handleSubmitResult(request.id)}
                    >
                      Submit Result
                    </button>
                  </div>
                )}

                {request.status === 'Completed' && request.result && (
                  <div className="labtech-result">
                    <p><strong>Result:</strong> {request.result}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default LabTech;