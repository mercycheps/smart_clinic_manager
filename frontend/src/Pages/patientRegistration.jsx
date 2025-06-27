// src/Pages/RegisterPatient.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import "../components/styling/register.css";

const RegisterPatient = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch("password");

  const handleRegister = async (data) => {
    const payload = {
      email: data.email,
      username: data.username,
      password: data.password,
      role: "patient",
      fullName: data.fullName,
      dob: data.dob,
      phone: data.phone,
      address: data.address,
    };

    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload), // Use the form data
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Registration successful:', result);
      navigate('/patients'); // Redirect on success
    } catch (error) {
      console.error('Registration failed:', error.message);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>MedPractice Pro</h1>
        <nav className="nav">
          <Link to="/">Dashboard</Link>
          <Link to="/patients">Patients</Link>
          <Link to="/register-patient" className="active">Add Patient</Link>
        </nav>
      </header>

      <div className="content">
        <h2>Register Patient</h2>
        <form onSubmit={handleSubmit(handleRegister)} className="form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input {...register("fullName", { required: "Required" })} />
              {errors.fullName && <p className="error">{errors.fullName.message}</p>}
            </div>
            <div className="form-group">
              <label>Date of Birth *</label>
              <input type="date" {...register("dob", { required: "Required" })} />
              {errors.dob && <p className="error">{errors.dob.message}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input type="email" {...register("email", { required: "Required" })} />
              {errors.email && <p className="error">{errors.email.message}</p>}
            </div>
            <div className="form-group">
              <label>Username *</label>
              <input {...register("username", { required: "Required" })} />
              {errors.username && <p className="error">{errors.username.message}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input {...register("phone")} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input {...register("address")} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input type="password" {...register("password", { required: "Required", minLength: { value: 6, message: "Minimum 6 characters" } })} />
              {errors.password && <p className="error">{errors.password.message}</p>}
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input type="password" {...register("confirmPassword", {
                required: "Required",
                validate: value => value === password || "Passwords do not match"
              })} />
              {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/patients')}>Cancel</button>
            <button type="submit">Register Patient</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPatient;