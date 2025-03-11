import React from "react";
import { useState } from "react";
import "./Medicine.css";
const Medicines= () => {
 
 const [search, setSearch] = useState("");
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>

  return (
    <div className="med"><div className="sear">Search Your Medicine</div>

      <input className="Search" placeholder="Search"
      onMouseEnter={(j)=>{setSearch(j.target.value)}}
      />
      <a className="fa"
        href={`https://www.1mg.com/search/all?name=${encodeURIComponent(search)}`}
             target="_blank"
            
         
        style={{ color: "white",backgroundColor:"orange",textDecoration:"none",fontSize:"30px" }}
   
      >
        
        &#128269;

     
      </a>
      
    </div>
  
  );
};

export default Medicines;
