import React from "react";
import "./header.css";

const Header = ({ activateSlide }) => {
  return (
    <>
      <div className="header">
        <div className="h_container_1">
          <div className="logo">Logo</div>
          <div className="h-profile">Profile</div>
          <div className="h-menu">Menu</div>
        </div>
        <div className="h_container_2">
          <div className="slide_opt opt_3" onClick={() => activateSlide(2)}>
            Personal Space
          </div>
          <div className="slide_opt opt_2" onClick={() => activateSlide(1)}>
            Service
          </div>
          <div className="slide_opt opt_1" onClick={() => activateSlide(0)}>
            Social
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
