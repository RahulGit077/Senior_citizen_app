import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import "./login.css"; // Adjusted import path

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "https://your-backend-url.com/api/login",
        { email, password }
      );

      if (response.status === 200) {
        if (rememberMe) {
          localStorage.setItem("userEmail", email);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={onSubmitHandler}>
        <p className="login-title">Login</p>
        <p className="login-subtitle">Please log in to continue.</p>
        {error && <p className="error-message">{error}</p>}

        {/* Email Input */}
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
            required
          />
        </div>

        {/* Password Input with Eye Icon */}
        <div className="input-group password-container">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="remember-me">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label htmlFor="rememberMe">Remember Me</label>
        </div>

        {/* Forgot Password */}
        <p
          className="forgot-password"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>

        {/* Login Button */}
        <button type="submit" className="login-button">
          Login
        </button>

        {/* Signup Link */}
        <p className="signup-link">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ cursor: "pointer", color: "blue" }}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
