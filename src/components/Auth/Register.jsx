import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    alert("Registration Successful! Navigating to Login...");
    navigate("/login");
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{" "}
        <span onClick={() => navigate("/login")} style={{ cursor: "pointer", color: "blue" }}>
          Login
        </span>
      </p>
    </div>
  );
};

export default Register;
