import React from "react";
import "./service.css"; // Assuming you're using some custom styles


const ServiceCard = ({ title, onClick,img }) => { // Accept onClick prop
  return (
    <div onClick={onClick} className="service_card"> {/* Use the passed onClick prop */}
      <h2 className="service_title">{title}</h2>
    </div>
  );
};

export default ServiceCard;
