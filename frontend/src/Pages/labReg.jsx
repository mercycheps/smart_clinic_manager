import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import "../components/styling/register.css";

const RegisterLabTech = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  const handleRegister = async (data) => {
    const payload = {
      email: data.email,
      username: data.username,
      password: data.password,
      role: "labtech",
      fullName: data.fullName,
      employeeId: data.employeeId,
      department: data.department,
    };

    try {
      const response = await fetch("/api/labtechnicians", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to register lab technician");
      navigate("/labtechs");
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <div className="register-container">
      <header className="register-header">
        <h1 className="header-title">MedPractice Pro</h1>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/labtechs" className="nav-link">Lab Techs</Link>
          <Link to="/register-labtech" className="nav-link active">Add Lab Technician</Link>
        </nav>
      </header>

      <div className="register-content">
        <h2 className="form-title">Register Lab Technician</h2>
        <form onSubmit={handleSubmit(handleRegister)} className="form">
          <div className="form-grid">
            <div>
              <label>Full Name *</label>
              <input {...register("fullName", { required: "Required" })} className="form-input" />
            </div>
            <div>
              <label>Employee ID *</label>
              <input {...register("employeeId", { required: "Required" })} className="form-input" />
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label>Email *</label>
              <input type="email" {...register("email", { required: "Required" })} className="form-input" />
            </div>
            <div>
              <label>Username *</label>
              <input {...register("username", { required: "Required" })} className="form-input" />
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label>Password *</label>
              <input type="password" {...register("password", { required: "Required", minLength: 6 })} className="form-input" />
            </div>
            <div>
              <label>Confirm Password *</label>
              <input type="password" {...register("confirmPassword", {
                required: "Required",
                validate: (value) => value === password || "Passwords do not match",
              })} className="form-input" />
              {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div>
            <label>Department</label>
            <input {...register("department")} className="form-input" />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/labtechs')} className="form-button cancel">Cancel</button>
            <button type="submit" className="form-button submit">Register Technician</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterLabTech;
