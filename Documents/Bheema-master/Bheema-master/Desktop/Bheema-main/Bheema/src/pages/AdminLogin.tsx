import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginPages: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Hardcoded Admin Credentials
    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin@123";

    if (email === adminEmail && password === adminPassword) {
      alert("Admin login successful");
      navigate("/admin");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Hotel Bheema</h1>
      <h2 style={styles.subtitle}>Admin Login</h2>
      <form style={styles.form} onSubmit={handleLogin}>
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

export default LoginPages;
