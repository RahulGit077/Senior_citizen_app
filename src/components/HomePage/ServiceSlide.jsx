import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ServiceCard from "./ServiceCard";
import Medicines from "./Medicines";
import Groceries from "./Groceries"



const ServiceSlide = () => {
  const navigate = useNavigate(); 

  const goToMedicines = () => {
    navigate('/medicines'); 
  };
  const goToFood=()=>{
    navigate('/food');
  }
  const goToGroceries=()=>{
    navigate('/groceries');
  }
  const goToCab=()=>{
    navigate('/cab');
  }

  return (
    <div className="service_slide">
      <ServiceCard title="Medicines" onClick={goToMedicines} /> 
      <ServiceCard title="Food"onClick={goToFood} />
      <ServiceCard title="Groceries"  onClick={goToGroceries}/>

    </div>
  );
};

export default ServiceSlide;
