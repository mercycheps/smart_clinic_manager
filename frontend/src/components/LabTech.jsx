import React, { useState } from 'react';

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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">Lab Technician Panel</h2>

      {labRequests.length === 0 ? (
        <p className="text-gray-500">No lab requests.</p>
      ) : (
        <div className="space-y-6">
          {labRequests.map((request) => (
            <div key={request.id} className="border p-4 rounded-md">
              <p><strong>Patient:</strong> {request.patientName}</p>
              <p><strong>Test Type:</strong> {request.testType}</p>
              <p><strong>Status:</strong> {request.status}</p>

              {request.status === 'Pending' && (
                <div className="mt-3 space-y-2">
                  <textarea
                    rows={3}
                    placeholder="Enter test results..."
                    className="w-full p-2 border rounded-md"
                    value={results[request.id] || ''}
                    onChange={(e) => handleInputChange(request.id, e.target.value)}
                  />
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    onClick={() => handleSubmitResult(request.id)}
                  >
                    Submit Result
                  </button>
                </div>
              )}

              {request.status === 'Completed' && request.result && (
                <div className="mt-2 text-green-600">
                  <p><strong>Result:</strong> {request.result}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabTech;
