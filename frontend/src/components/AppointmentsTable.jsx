import React from "react";
import "./appointments.css"; // Import the plain CSS file

const AppointmentsTable = ({ appointments = [] }) => {
  return (
    <div className="appointments-table-container">
      <h3 className="appointments-table-title">Today's Appointments</h3>
      <table className="appointments-table">
        <thead>
          <tr className="appointments-table-header">
            <th>Patient</th>
            <th>Time</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appt, index) => (
              <tr key={index} className="appointments-table-row">
                <td>{appt.patient}</td>
                <td>{appt.time}</td>
                <td>{appt.reason}</td>
                <td>
                  <span
                    className={`status-badge ${
                      appt.status === "pending" ? "status-pending" : "status-completed"
                    }`}
                  >
                    {appt.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="appointments-table-empty">
                No appointments scheduled today.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsTable;