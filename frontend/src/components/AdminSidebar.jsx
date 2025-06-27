import React from "react";
import {
  Calendar,
  Users,
  Stethoscope,
  FlaskConical,
} from "lucide-react";
import "../components/styling/admin.css";

const menuItems = [
  { title: "Appointments", icon: Calendar, key: "appointments" },
  { title: "Doctor Dashboard", icon: Stethoscope, key: "doctor" },
  { title: "Lab Technician", icon: FlaskConical, key: "labtech" },
  { title: "Patient Records", icon: Users, key: "patients" },
];

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-header-icon">
            <Stethoscope className="sidebar-menu-button-icon text-white" />
          </div>
          <h2 className="sidebar-header-title">MedAdmin</h2>
        </div>

        {/* Navigation */}
        <div className="sidebar-group">
          <div className="sidebar-group-label">Navigation</div>
          <div className="sidebar-menu">
            {menuItems.map((item) => (
              <div
                key={item.key}
                className={`sidebar-menu-item ${
                  activeTab === item.key ? "active" : ""
                }`}
              >
                <button
                  onClick={() => setActiveTab(item.key)}
                  className="sidebar-menu-button"
                >
                  <item.icon className="sidebar-menu-button-icon" />
                  <span className="sidebar-menu-button-text">
                    {item.title}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
