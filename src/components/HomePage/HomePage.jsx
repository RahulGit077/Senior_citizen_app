import React from "react";
import ServiceSlide from "./ServiceSlide";
import SocialSlide from "./SocialSlide";
import Header from "./Header";

const HomePage = () => {
  const [activeSlide, setActiveSlide] = React.useState("social");
  const activateSlide = (opt) => {
    if (opt) {
      setActiveSlide("service");
      document.querySelector(".opt_1").style.borderBottom = "2px solid white";
      document.querySelector(".opt_2").style.borderBottom =
        "1px solid transparent";
      document.querySelector(".opt_2").style.backgroundColor =
        "rgb(11, 11, 95)";
      document.querySelector(".opt_1").style.backgroundColor = "darkblue";
    } else {
      setActiveSlide("social");
      document.querySelector(".opt_2").style.borderBottom = "2px solid white";
      document.querySelector(".opt_1").style.borderBottom =
        "1px solid transparent";
      document.querySelector(".opt_1").style.backgroundColor =
        "rgb(11, 11, 95)";
      document.querySelector(".opt_2").style.backgroundColor = "darkblue";
    }
  };
  return (
    <div>
      <Header activateSlide={activateSlide} />
      {activeSlide === "social" ? <SocialSlide /> : <ServiceSlide />}
    </div>
  );
};

export default HomePage;
