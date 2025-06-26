import { useEffect, useState } from "react";

export default function PatientDashboard() {
  const [testResults, setTestResults] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState("");


  // fetching test results and available tests
  useEffect(() => {

    // Flask API
    setTestResults([
      { id: 1, testName: "Blood Test", result: "Normal", date: "2025-06-20" },
      { id: 2, testName: "X-Ray", result: "No issues", date: "2025-06-21" },
    ]);


    setLabTests([
      { id: 1, name: "Blood Test" },
      { id: 2, name: "X-Ray" },
      { id: 3, name: "MRI" },
    ]);
  }, []);


  const handleBookTest = (e) => {
    e.preventDefault();
    if (!selectedTestId) return;


    const booked = labTests.find((t) => t.id === parseInt(selectedTestId));
    alert(`Booked: ${booked.name}`);
    setSelectedTestId("");
  };


  return (
    <div className="max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Your Test Results</h2>
      <ul className="space-y-3">
        {testResults.map((result) => (
          <li
            key={result.id}
            className="border p-3 rounded bg-white shadow flex justify-between"
          >
            <div>
              <p className="font-semibold">{result.testName}</p>
              <p className="text-gray-600 text-sm">{result.result}</p>
            </div>
            <span className="text-sm text-gray-500">{result.date}</span>
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mt-8 mb-2">Book a Lab Test</h3>
      <form onSubmit={handleBookTest} className="flex gap-2">
        <select
          value={selectedTestId}
          onChange={(e) => setSelectedTestId(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select a test</option>
          {labTests.map((test) => (
            <option key={test.id} value={test.id}>
              {test.name}
            </option>
            
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Book
        </button>
      </form>
    </div>
  );
}
