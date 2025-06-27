// src/Pages/RegisterOptions.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import "../components/styling/register.css";

const RegisterOptions = () => {
  return (
    <div className="register-container">
      <header className="register-header">
        <div className="header-content">
          <h1 className="header-title">MedPractice Pro</h1>
          <nav className="header-nav">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/doctors" className="nav-link">Doctors</Link>
            <Link to="/labtechs" className="nav-link">Lab Techs</Link>
            <Link to="/patients" className="nav-link">Patients</Link>
          </nav>
        </div>
      </header>

      <div className="register-content">
        <h2 className="form-title">Choose Registration Form</h2>
        <div className="form-actions" style={{ justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
          <Link to="/register-doctor" className="form-button submit">Register Doctor</Link>
          <Link to="/register-labtech" className="form-button submit">Register Lab Technician</Link>
          <Link to="/register-patient" className="form-button submit">Register Patient</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterOptions;
