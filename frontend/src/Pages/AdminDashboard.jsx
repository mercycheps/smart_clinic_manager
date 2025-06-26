import React, { useState } from "react";
import AdminAppointments from "../components/AdminAppointments";
import Doctor from "./Doctor";
import LabTech from "./LabTech";
import PatientsRecords from "./PatientsRecords";
import AdminSidebar from "../components/AdminSidebar";
import "../components/styling/admin.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleAppointmentBooked = () => {
    setRefreshFlag((prev) => !prev);
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="admin-main">
        <h1 className="admin-title">Admin Panel</h1>

        {activeTab === "appointments" && (
          <AdminAppointments onBook={handleAppointmentBooked} />
        )}
        {activeTab === "doctor" && <Doctor refreshFlag={refreshFlag} />}
        {activeTab === "labtech" && <LabTech />}
        {activeTab === "patients" && <PatientsRecords />}
      </div>
    </div>
  );
};

export default AdminDashboard;
