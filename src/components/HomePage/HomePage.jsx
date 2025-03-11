import React from "react";
import ServiceSlide from "./ServiceSlide";
import SocialSlide from "./SocialSlide";
import Header from "./Header";
import PersonalSlide from "./PersonalSlide";

const HomePage = () => {
  const [activeSlide, setActiveSlide] = React.useState("personal");

  // Function to handle the SOS action (Call & SMS)
  const handleSOS = () => {
    const phoneNumber = "7502492263"; // Replace with your emergency contact number
    const message = encodeURIComponent("🚨 SOS Alert! I need help immediately.");
    
    // Open both Call and SMS in sequence
    window.open(`tel:${phoneNumber}`, "_self"); // Opens call
    setTimeout(() => {
      window.open(`sms:${phoneNumber}?body=${message}`, "_self"); // Opens SMS after call
    }, 2000); // Delay SMS for 2 seconds after call
  };

  const activateSlide = (opt) => {
    if (opt === 1) {
      setActiveSlide("service");
      document.querySelector(".opt_1").style.borderBottom = "2px solid white";
      document.querySelector(".opt_2").style.borderBottom = "1px solid transparent";
      document.querySelector(".opt_3").style.borderBottom = "1px solid transparent";
      document.querySelector(".opt_2").style.backgroundColor = "rgb(11, 11, 95)";
      document.querySelector(".opt_1").style.backgroundColor = "darkblue";
      document.querySelector(".opt_3").style.backgroundColor = "darkblue";
    } else if (opt === 2) {
      setActiveSlide("personal");
      document.querySelector(".opt_3").style.borderBottom = "2px solid white";
      document.querySelector(".opt_2").style.borderBottom = "1px solid transparent";
      document.querySelector(".opt_1").style.borderBottom = "1px solid transparent";
      document.querySelector(".opt_2").style.backgroundColor = "darkblue";
      document.querySelector(".opt_1").style.backgroundColor = "darkblue";
      document.querySelector(".opt_3").style.backgroundColor = "rgb(11, 11, 95)";
    } else {
      setActiveSlide("social");
      document.querySelector(".opt_2").style.borderBottom = "2px solid white";
      document.querySelector(".opt_1").style.borderBottom = "1px solid transparent";
      document.querySelector(".opt_3").style.borderBottom = "1px solid transparent";
      document.querySelector(".opt_1").style.backgroundColor = "rgb(11, 11, 95)";
      document.querySelector(".opt_2").style.backgroundColor = "darkblue";
      document.querySelector(".opt_3").style.backgroundColor = "darkblue";
    }
  };

  return (
    <div style={styles.container}>
      {/* SOS Button in Top Right Corner */}
      <button style={styles.sosButton} onClick={handleSOS}>
       SOS
      </button>

      {/* Page Content */}
      <Header activateSlide={activateSlide} />
      {activeSlide === "social" ? (
        <SocialSlide />
      ) : activeSlide === "service" ? (
        <ServiceSlide />
      ) : (
        <PersonalSlide />
      )}
    </div>
  );
};

// CSS Styles for SOS Button and Layout
const styles = {
  container: {
    position: "relative",
    minHeight: "100vh",
  },
  sosButton: {
    position: "absolute",
    top: "5px",
    right: "5px",
    fontSize: "10px",
   
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    zIndex: 1000, // Ensures it stays on top
  },
};

export default HomePage;
