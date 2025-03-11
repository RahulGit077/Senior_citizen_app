import React from "react";
import { useState } from "react";
import "./service.css";
import "./Medicine.css";


const Groceries= () => {
 
 const [search, setSearch] = useState("");
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>



  return (
    <div className="med"><div className="sear">Search Your Groceries</div>

      <input className="Search" placeholder="Search"
       onMouseEnter={(e)=>{setSearch(e.target.value)}}
      />
      <a className="fa"
        href={`https://www.bigbasket.com/ps/?q=${encodeURIComponent(search)}`}
         target="_blank"
         style={{ color: "white",backgroundColor:"orange",textDecoration:"none",fontSize:"30px" }}
      >
       &#128269;
      </a>
    </div>
  );
};

export default Groceries;
