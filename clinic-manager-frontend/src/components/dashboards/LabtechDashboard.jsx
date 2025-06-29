import React, { useEffect, useState } from 'react'
import axios from 'axios'

const LabtechDashboard = () => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const [assignedTests, setAssignedTests] = useState([])
  const [resultInputs, setResultInputs] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchAssignedTests()
  }, [])

  const fetchAssignedTests = async () => {
    try {
      const res = await axios.get('http://localhost:3005/labtech/assigned', { headers })
      setAssignedTests(res.data)
    } catch (err) {
      setMessage('Failed to fetch assigned tests')
    }
  }

  const handleChange = (id, value) => {
    setResultInputs(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e, resultId) => {
    e.preventDefault()
    const results = resultInputs[resultId]
    if (!results) {
      setMessage('Please enter a result before submitting.')
      return
    }
    try {
      await axios.post('http://localhost:3005/labtech/record', {
        result_id: resultId,
        results
      }, { headers })
      setMessage('Lab result submitted successfully.')
      setResultInputs(prev => ({ ...prev, [resultId]: '' })) // Clear input
      fetchAssignedTests()
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Submission failed.')
    }
  }

  return (
    <div className="container">
      <h2>Lab Technician Dashboard</h2>

      <h3>Assigned Lab Tests</h3>
      {assignedTests.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Test Description</th>
              <th>Existing Results</th>
              <th>Submit New Result</th>
            </tr>
          </thead>
          <tbody>
            {assignedTests.map((test) => (
              <tr key={test.id}>
                <td>{test.patient_name}</td>
                <td>{test.test_description || <em>Not specified</em>}</td>
                <td>{test.results || <em>Pending</em>}</td>
                <td>
                  <form onSubmit={(e) => handleSubmit(e, test.id)}>
                    <input
                      type="text"
                      placeholder="Enter result"
                      value={resultInputs[test.id] || ''}
                      onChange={(e) => handleChange(test.id, e.target.value)}
                      required
                    />
                    <button type="submit">Save</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No lab test assignments yet.</p>
      )}

      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
    </div>
  )
}

export default LabtechDashboard
