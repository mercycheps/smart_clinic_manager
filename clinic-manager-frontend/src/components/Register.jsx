// src/components/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

function Register() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    username: '',
    phone_number: '',
    password: '',
    confirm_password: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm_password) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    const res = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (res.ok) {
      setSuccessMsg('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setErrorMsg(data.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register as Patient</h2>
      <form onSubmit={handleRegister}>
        <input type="text" name="full_name" placeholder="Full Name" value={form.full_name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="text" name="phone_number" placeholder="Phone Number" value={form.phone_number} onChange={handleChange} required />
        <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input type="password" name="confirm_password" placeholder="Confirm Password" value={form.confirm_password} onChange={handleChange} required />

        {errorMsg && <p className="error-msg">{errorMsg}</p>}
        {successMsg && <p className="success-msg">{successMsg}</p>}
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;

