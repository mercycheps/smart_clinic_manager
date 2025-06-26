import React from "react";
import { Link } from "react-router-dom";

export default function PatientDashboard() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6">Welcome, Patient</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-bold mb-2">My Appointments</h3>
          <p>You will see upcoming and past appointments here.</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Lab Results</h3>
          <p>Lab test results will be shown here.</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Prescriptions</h3>
          <p>Prescriptions from your doctor will be listed.</p>
        </div>

        <div className="bg-white p-4 rounded shadow flex items-center justify-between">
          <span>Need to book a new appointment?</span>
          <Link
            to="/book-appointment"
            className="text-blue-600 hover:underline font-medium"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
