import React from "react";
import { useState } from "react";
import "./Cab.css";

const Cab= () => {
 
 const [search, setSearch] = useState("")

  return (
    <div className="u">
    <div className="e"> Select Your Peffered Cab Service</div>
      <a 
        href="https://book.fasttrackcalltaxi.in/"
             target="_blank"
            
   
      >
        
    <div className="e1">Fast Track</div>

     
      </a>
      
    </div>
  
  );
};

export default Cab;
