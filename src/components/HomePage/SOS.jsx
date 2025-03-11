import React from "react";

const SOS = () => {
  // Function to send SOS message
  const sendSOS = () => {
    const phoneNumber = "7502492263"; // Replace with emergency contact number
    const message = encodeURIComponent("🚨 SOS Alert! I need help immediately.");
    window.location.href = `sms:${phoneNumber}?body=${message}`;
  };

  return (
    <div style={styles.container}>
      <h1 style={{ color: "red" }}>Emergency SOS</h1>

      {/* SOS Button - Sends SMS */}
      <button style={styles.sosButton} onClick={sendSOS}>
        🚨 SOS 🚨
      </button>

      {/* Emergency Call Button */}
      <a href="tel:911" style={styles.callButton}>
        Call Emergency 📞
      </a>
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    textAlign: "center",
    padding: "50px",
    backgroundColor: "#ffcccc",
    minHeight: "100vh",
  },
  sosButton: {
    fontSize: "50px",
    padding: "20px 40px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    marginBottom: "20px",
  },
  callButton: {
    display: "inline-block",
    marginTop: "20px",
    fontSize: "20px",
    textDecoration: "none",
    backgroundColor: "black",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
  },
};

export default SOS;
