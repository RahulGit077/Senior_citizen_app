import React from "react";
import ServiceCard from "./ServiceCard";

const ServiceSlide = () => {
  return (
    <div className="service_slide">
      <ServiceCard title="Medicines" />
      <ServiceCard title="Cab" />
      <ServiceCard title="Food" />
    </div>
  );
};

export default ServiceSlide;
