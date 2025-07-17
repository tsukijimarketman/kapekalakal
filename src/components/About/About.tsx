import React from "react";
import Section1_About from "./Section1_About";
import Section2_About from "./Section2_About";
import Section3_About from "./Section3_About";
import Section4_About from "./Section4_About";
import Section5_About from "./Section5_About";

const About = () => {
  return (
    <div className="w-full mt-[8.3vh]">
      <Section1_About />
      <Section2_About />
      <Section3_About />
      <Section4_About />
      <Section5_About />
    </div>
  );
};

export default About;
