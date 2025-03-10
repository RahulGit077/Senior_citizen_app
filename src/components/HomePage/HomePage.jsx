import React from "react";
import ServiceSlide from "./ServiceSlide";
import SocialSlide from "./SocialSlide";
import Header from "./Header";
import PersonalSlide from "./PersonalSlide";

const HomePage = () => {
  const [activeSlide, setActiveSlide] = React.useState("personal");
  const activateSlide = (opt) => {
    if (opt == 1) {
      setActiveSlide("service");
      document.querySelector(".opt_1").style.borderBottom = "2px solid white";
      document.querySelector(".opt_2").style.borderBottom =
        "1px solid transparent";
      document.querySelector(".opt_3").style.borderBottom =
        "1px solid transparent";
      document.querySelector(".opt_2").style.backgroundColor =
        "rgb(11, 11, 95)";
      document.querySelector(".opt_1").style.backgroundColor = "darkblue";
      document.querySelector(".opt_3").style.backgroundColor = "darkblue";
    } else if (opt == 2) {
      setActiveSlide("personal");
      document.querySelector(".opt_3").style.borderBottom = "2px solid white";
      document.querySelector(".opt_2").style.borderBottom =
        "1px solid transparent";
      document.querySelector(".opt_1").style.borderBottom =
        "1px solid transparent";
      document.querySelector(".opt_2").style.backgroundColor = "darkblue";
      document.querySelector(".opt_1").style.backgroundColor = "darkblue";
      document.querySelector(".opt_3").style.backgroundColor =
        "rgb(11, 11, 95)";
    } else {
      setActiveSlide("social");
      document.querySelector(".opt_2").style.borderBottom = "2px solid white";
      document.querySelector(".opt_1").style.borderBottom =
        "1px solid transparent";
      document.querySelector(".opt_3").style.borderBottom =
        "1px solid transparent";
      document.querySelector(".opt_1").style.backgroundColor =
        "rgb(11, 11, 95)";
      document.querySelector(".opt_2").style.backgroundColor = "darkblue";
      document.querySelector(".opt_3").style.backgroundColor = "darkblue";
    }
  };
  return (
    <div>
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

export default HomePage;
