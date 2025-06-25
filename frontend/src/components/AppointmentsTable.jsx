import React from "react";

const AppointmentsTable = ({ appointments = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Today's Appointments</h3>
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Patient</th>
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">Reason</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appt, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{appt.patient}</td>
                <td className="px-4 py-2">{appt.time}</td>
                <td className="px-4 py-2">{appt.reason}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${appt.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                    {appt.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
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
