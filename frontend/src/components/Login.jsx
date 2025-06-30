// frontend/src/components/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { parseJwt } from '../utils/jwt'; // Ensure this exists or replace with inline decoder

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData);
      const { access_token } = res.data;

      if (!access_token) {
        setMessage('Login failed: No token received.');
        return;
      }

      localStorage.setItem('token', access_token);
      const decoded = parseJwt(access_token);

      const role = decoded?.role;
      const userId = decoded?.id;

      if (!role || !userId) {
        setMessage('Login succeeded but user data is incomplete.');
        return;
      }

      localStorage.setItem('role', role);
      localStorage.setItem('id', userId);

      switch (role) {
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
          setMessage('Unknown role.');
      }

    } catch (err) {
      console.error('Login error:', err);
      setMessage(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="container">
      <h2>Login to Smart Clinic</h2>
      <form onSubmit={handleSubmit}>
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

        <button type="submit">Login</button>
      </form>

      {message && (
        <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{message}</p>
      )}

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default Login;
