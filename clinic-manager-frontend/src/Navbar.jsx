// src/components/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./components/Dashboard.css";


const Navbar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getTitle = () => {
    switch (role) {
      case 'admin': return 'Admin Dashboard';
      case 'doctor': return 'Doctor Dashboard';
      case 'labtech': return 'Lab Technician Dashboard';
      case 'patient': return 'Patient Dashboard';
      default: return 'Smart Clinic Manager';
    }
  };

  return (
    <nav className="navbar">
      <h2>{getTitle()}</h2>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
