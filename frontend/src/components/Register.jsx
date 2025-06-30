// src/components/Register.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    password: '',
    role: 'patient'
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData);
      setMessage('✅ Registration successful! Redirecting...');

      // Redirect based on role after short delay
      setTimeout(() => {
        switch (formData.role) {
          case 'patient':
            navigate('/patient-dashboard');
            break;
          case 'doctor':
            navigate('/doctor-dashboard');
            break;
          case 'labtech':
            navigate('/labtech-dashboard');
            break;
          case 'admin':
            navigate('/admin-dashboard');
            break;
          default:
            navigate('/login');
        }
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err);
      setMessage(err.response?.data?.msg || '❌ Registration failed.');
    }
  };

  return (
    <div className="container">
      <h2>Register for Smart Clinic</h2>
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />

        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Role</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="labtech">Lab Technician</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Register</button>
      </form>

      {message && (
        <p style={{ color: message.startsWith('✅') ? 'green' : 'red', textAlign: 'center' }}>
          {message}
        </p>
      )}

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Register;
