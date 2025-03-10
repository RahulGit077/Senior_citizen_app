import React from "react";
import "./service.css";

const ServiceCard = ({ title }) => {
  const button = () => {
    console.log("Hello Clicked");
  };
  return (
    <>
      <div onClick={button} className="service_card">
        <h2 className="service_title">{title}</h2>
      </div>
    </>
  );
};

export default ServiceCard;
