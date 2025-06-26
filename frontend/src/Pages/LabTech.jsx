import React, { useEffect, useState } from "react";
import { FlaskConical, TestTube, AlertCircle, CheckCircle } from "lucide-react";
import "../components/styling/lab.css";

const LabTech = () => {
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLabTests = () => {
    const token = localStorage.getItem("access_token");

    fetch("http://localhost:5000/api/lab-tests", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or server error");
        return res.json();
      })
      .then((data) => {
        setLabTests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch lab tests:", err);
        setLabTests([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLabTests();
  }, []);

  const getStatusColor = (status) => `status-${status}`;
  const getPriorityColor = (priority) => `priority-${priority}`;
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="icon-green" />;
      case "in-progress":
        return <TestTube className="icon-yellow" />;
      case "pending":
        return <AlertCircle className="icon-blue" />;
      default:
        return null;
    }
  };

  const stats = [
    { title: "Pending Tests", value: labTests.filter((t) => t.status === "pending").length, className: "text-blue" },
    { title: "In Progress", value: labTests.filter((t) => t.status === "in-progress").length, className: "text-yellow" },
    { title: "Completed Today", value: labTests.filter((t) => t.status === "completed").length, className: "text-green" },
    { title: "Urgent Tests", value: labTests.filter((t) => t.priority === "urgent").length, className: "text-red" },
  ];

  return (
    <div className="lab-dashboard">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="card-content">
              <div className="stats-box">
                <div>
                  <p className="stat-title">{stat.title}</p>
                  <p className={`stat-value ${stat.className}`}>{stat.value}</p>
                </div>
                <FlaskConical className={`icon ${stat.className}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <TestTube className="icon-blue" />
            Lab Tests Queue
          </h2>
          <p className="card-description">Manage and process laboratory tests</p>
        </div>
        <div className="card-content">
          {loading ? (
            <p className="text-muted">Loading lab tests...</p>
          ) : labTests.length === 0 ? (
            <p className="text-muted">No lab tests available.</p>
          ) : (
            <div className="test-list">
              {labTests.map((test) => (
                <div key={test.id} className="test-card">
                  <div className="test-header">
                    <div className="test-info">
                      <div className="test-title">
                        <h3>{test.patient}</h3>
                        <span className={`badge ${getPriorityColor(test.priority)}`}>{test.priority}</span>
                      </div>
                      <p className="test-name">{test.test}</p>
                      <p className="test-meta">Ordered by {test.doctor} at {test.ordered}</p>
                    </div>

                    <div className="test-controls">
                      <div className="status-badge">
                        {getStatusIcon(test.status)}
                        <span className={`badge ${getStatusColor(test.status)}`}>{test.status}</span>
                      </div>

                      {test.status === "pending" && (
                        <button className="btn btn-blue">Start Test</button>
                      )}

                      {test.status === "in-progress" && (
                        <button className="btn btn-outline-green">Complete</button>
                      )}

                      {test.status === "completed" && (
                        <button className="btn">View Results</button>
                      )}
                    </div>
                  </div>
                  <div className="test-id">Test ID: {test.id}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabTech;
