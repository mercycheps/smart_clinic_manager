// src/Pages/Login.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import "../components/styling/login.css";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email, password, role }) => {
    console.log("Form submitted:", { email, password, role });

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Login successful:", data);
      localStorage.setItem("token", data.access_token); // Store JWT for PatientDashboard
      localStorage.setItem("userRole", role.toLowerCase());

      // Navigate based on role
      switch (role.toLowerCase()) {
        case "patient":
          navigate("/patients-dashboard");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "doctor":
          navigate("/doctor");
          break;
        case "labtech":
          navigate("/lab-tech");
          break;
        default:
          navigate("/login");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            className="form-input"
          />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
            className="form-input"
          />
          {errors.password && <p className="form-error">{errors.password.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            id="role"
            {...register("role", { required: "Role is required" })}
            className="form-input"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="labtech">Lab Technician</option>
            <option value="patient">Patient</option>
          </select>
          {errors.role && <p className="form-error">{errors.role.message}</p>}
        </div>

        <button type="submit" className="login-button">Login</button>
      </form>

      <div className="login-register-link">
        <p>Don't have an account?</p>
        <Link to="/register" className="register-link">Register here</Link>
      </div>
    </div>
  );
};

export default Login;