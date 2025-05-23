import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (res.status === 200) {
        // optionally store token in localStorage or context
        localStorage.setItem("token", res.data.token);
        alert("Login successful!");
        localStorage.setItem("isLogedin", "true");
        navigate("/"); // redirect to homepage
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      alert(message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Hotel Bheema</h1>
      <h2 style={styles.subtitle}>Login</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={styles.button}>Login</button>
        <p style={{ marginTop: 12 }}>
          Don’t have an account? <Link to="/signup" style={styles.link}>Sign up</Link>
        </p>
      </form>
    </div>
  );
};



export const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#e9f7ec",
  },
  title: {
    color: "#2e7d32",
    fontSize: "2.5rem",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1.5rem",
    color: "#388e3c",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: 300,
    marginTop: 16,
  },
  input: {
    padding: 10,
    margin: "8px 0",
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#4caf50",
    color: "white",
    padding: 10,
    marginTop: 10,
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  link: {
    color: "#2e7d32",
    textDecoration: "none",
    fontWeight: "bold",
  }
};

export default LoginPage;