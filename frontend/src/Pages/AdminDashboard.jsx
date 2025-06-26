import React, { useState } from "react";
import AdminAppointmentForm from "./AdminAppointmentForm";
import Doctor from "./Doctor";

const AdminDashboard = () => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleAppointmentBooked = () => {
    setRefreshFlag((prev) => !prev); // toggle to force re-fetch
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Panel</h1>
      <AdminAppointmentForm onBook={handleAppointmentBooked} />
      <Doctor refreshFlag={refreshFlag} />
    </div>
  );
};

export default AdminDashboard;
