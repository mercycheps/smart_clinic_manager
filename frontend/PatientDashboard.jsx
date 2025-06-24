import { useState, useEffect } from 'react'


export default function PatientDashboard() {
  const [results, setResults] = useState([])
  const [formData, setFormData] = useState({ test_type: '', date: '' })

  
  // Fetching lab results
  useEffect(() => {
    fetch("http://localhost:5000/api/results") 
      .then(res => res.json())
      .then(data => setResults(data))
  }, [])


  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault()
    fetch("http://localhost:5000/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      alert("Appointment booked!")
      setFormData({ test_type: '', date: '' })
    })
  }


  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Patient Dashboard</h1>

      {/* Book Test Form */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Book a Lab Test</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Test Type:</label>
            <input
              type="text"
              value={formData.test_type}
              onChange={e => setFormData({ ...formData, test_type: e.target.value })}
              className="w-full border p-2"
              required/>

          </div>
          <div>
            <label className="block">Date:</label>
            <input
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full border p-2"
              required/>

          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2">Book</button>
        </form>
      </div>


      {/* Lab Results */}
      <div>
        <h2 className="text-xl font-semibold mb-2">My Lab Results</h2>
        {results.length === 0 ? (
          <p>No results available.</p>
        ) : (

          <ul className="divide-y">
            {results.map(result => (
              <li key={result.id} className="py-2">
                <strong>{result.test_type}</strong> - {result.status} <br />
                <small>{new Date(result.date).toLocaleDateString()}</small>
              </li>
            ))}
            
          </ul>
        )}

      </div>
    </div>
  )
}
