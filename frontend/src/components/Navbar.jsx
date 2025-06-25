import React from "react";
import { Link } from "react-router-dom";
import "../components/styling/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">Smart Clinic Manager</h1>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/doctor" className="navbar-link">Doctor Dashboard</Link>
          <Link to="/lab-tech" className="navbar-link">Lab Technician</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;