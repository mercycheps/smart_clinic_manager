import React from 'react';
import SummaryCard from './SummaryCard';
import AppointmentsTable from './AppointmentsTable';
import RecentActivity from './RecentActivity';

const DoctorDashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard title="Patients" count={120} />
        <SummaryCard title="Today's Appointments" count={8} />
        <SummaryCard title="Pending Records" count={3} />
        <SummaryCard title="Lab Results to Review" count={5} />
      </div>

      {/* Appointments and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AppointmentsTable />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
