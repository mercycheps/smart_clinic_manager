// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('user_id', data.user.id);

      switch (data.user.role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'doctor':
          navigate('/doctor-dashboard');
          break;
        case 'patient':
          navigate('/patient-dashboard');
          break;
        case 'labtech':
          navigate('/labtech-dashboard');
          break;
        default:
          setErrorMsg('Invalid user role.');
      }
    } else {
      setErrorMsg(data.message || 'Incorrect login credentials.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Smart Clinic Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMsg && <p className="error-msg">{errorMsg}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
