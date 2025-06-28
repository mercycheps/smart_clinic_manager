import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/styles/login.css";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    setIsLoading(true);

    try {
      const response = await axios.post("http://192.168.1.3:5000/api/users/login", {
        email: data.email,
        password: data.password,
      });

      // Store user data in localStorage
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("user_id", response.data.user_id);
      localStorage.setItem("username", response.data.username);

      alert("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Login failed. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h2 className="login-title">Sign In</h2>
      <p className="login-subtitle">Enter your email and password to continue</p>

      <form onSubmit={handleSubmit(handleLogin)} className="login-form">
        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            })}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Footer links */}
      <div className="login-footer">
        <p>
          Don't have an account?{" "}
          <a href="/register" className="link">
            Sign up here
          </a>
        </p>
        <a href="/forgot-password" className="link">
          Forgot your password?
        </a>
      </div>
    </div>
  );
};

export default Login;
