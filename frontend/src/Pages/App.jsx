import React from 'react';
import { Outlet } from 'react-router-dom';
import Register from './Register';
import LabTech from '../components/LabTech';
import DoctorDashboard from '../components/DoctorDashboard';
import './App.css'; // Make sure Tailwind is imported here if not already
import 'Index.css'; // Import your global styles if needed

function App() {
  const handleDoctorSubmit = (data) => {
    console.log("Submitted Doctor Data:", data);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 space-y-12">
      {/* Tailwind test box */}
      <div className="bg-red-500 text-white p-10 text-2xl text-center rounded">
        Tailwind is Working!
      </div>

      <section>
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Doctor Registration
        </h1>
        <Register onSubmit={handleDoctorSubmit} />
      </section>

      <hr className="my-10 border-t border-gray-300" />

      <section>
        <h1 className="text-3xl font-bold text-center text-purple-600 mb-6">
          Lab Technician Panel
        </h1>
        <LabTech />
        <DoctorDashboard />
      </section>

      <Outlet />
    </div>
  );
}

export default App;
