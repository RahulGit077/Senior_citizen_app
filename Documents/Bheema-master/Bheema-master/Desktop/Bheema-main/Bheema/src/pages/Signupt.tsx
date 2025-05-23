import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Hotel Bheeme</h1>
      <h2 style={styles.subtitle}>Sign Up</h2>
      <form style={styles.form} onSubmit={handleSignup}>
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
        <input
          type="password"
          placeholder="Confirm Password"
          style={styles.input}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button type="submit" style={styles.button}>Register</button>
        <p style={{ marginTop: 12 }}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </form>
    </div>
  );
};


const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0fff4",
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
    backgroundColor: "#388e3c",
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



export default SignupPage;
