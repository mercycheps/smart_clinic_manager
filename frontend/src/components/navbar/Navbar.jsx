// frontend/src/components/navbar/Navbar.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    navigate('/login');
  };

  return (
    <nav style={{
      padding: '1rem 2rem',
      backgroundColor: '#007bff',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        🏥 Smart Clinic Manager
      </div>
      <button onClick={handleLogout} style={{
        backgroundColor: '#fff',
        color: '#007bff',
        border: '1px solid #fff',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
