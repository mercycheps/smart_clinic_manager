import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../components/styling/login.css";

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  
  const onSubmit = ({ email, password, role }) => {
    // You can replace this with real backend validation
    if (email && password && role) {
      localStorage.setItem("userRole", role.toLowerCase());
      navigate("/");
    } else {
      alert("Please fill all fields correctly.");
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
    </div>
  );
};

export default Login;