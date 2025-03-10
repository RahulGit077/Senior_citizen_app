import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import "./Signup.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "https://your-backend-url.com/api/register",
        { name, email, password }
      );

      if (response.status === 201) {
        setSuccess("Account created successfully! You can now log in.");
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-box" onSubmit={onSubmitHandler}>
        {/* Close Button */}
        <FaTimes className="close-icon" onClick={() => navigate("/")} />

        <p className="signup-title">Create Account</p>
        <p className="signup-subtitle">Please sign up to book an appointment.</p>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        {/* Name Input */}
        <div className="input-group">
          <label>Full Name</label>
          <input
            type="text"
            onChange={(event) => setName(event.target.value)}
            value={name}
            required
          />
        </div>

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

        <button type="submit" className="signup-button">Sign Up</button>

        <p className="login-link">
          Already have an account? <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default Register;
