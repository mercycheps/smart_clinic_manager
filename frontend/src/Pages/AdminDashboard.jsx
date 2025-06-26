import React, { useState, useEffect } from "react";
import AdminAppointments from "../components/AdminAppointments";
import Doctor from "./Doctor";
import LabTech from "./LabTech";
import PatientsRecords from "./PatientsRecords";
import AdminSidebar from "../components/AdminSidebar";
import "../components/styling/admin.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchUsers = (role) => {
    const token = localStorage.getItem("access_token");
    setLoadingUsers(true);

    fetch(`http://localhost:5000/users?role=${role}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoadingUsers(false);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setUsers([]);
        setLoadingUsers(false);
      });
  };

  useEffect(() => {
    if (activeTab === "doctor") fetchUsers("doctor");
    if (activeTab === "labtech") fetchUsers("lab-tech");
    if (activeTab === "patients") fetchUsers("patient");
  }, [activeTab, refreshFlag]);

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

        {activeTab === "doctor" && (
          loadingUsers ? (
            <p>Loading doctors...</p>
          ) : (
            <Doctor users={users} refreshFlag={refreshFlag} />
          )
        )}

        {activeTab === "labtech" && (
          loadingUsers ? (
            <p>Loading lab technicians...</p>
          ) : (
            <LabTech users={users} />
          )
        )}

        {activeTab === "patients" && (
          loadingUsers ? (
            <p>Loading patients...</p>
          ) : (
            <PatientsRecords users={users} />
          )
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
