import React from 'react';
import DoctorForm from './components/DoctorForm';
import LabTech from './components/LabTech';

function App() {
  const handleDoctorSubmit = (data) => {
    console.log("Submitted Doctor Data:", data);
    // Optional: send to backend via fetch/axios
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 space-y-12">
      <section>
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Doctor Registration
        </h1>
        <DoctorForm onSubmit={handleDoctorSubmit} />
      </section>

      <hr className="my-10 border-t border-gray-300" />

      <section>
        <h1 className="text-3xl font-bold text-center text-purple-600 mb-6">
          Lab Technician Panel
        </h1>
        <LabTech />
      </section>
    </div>
  );
}

export default App;
