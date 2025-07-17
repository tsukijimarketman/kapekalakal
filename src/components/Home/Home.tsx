import React from "react"; // Adjust the path as necessary

import Section1_Home from "./Section1_Home";
import Section2_Home from "./Section2_Home";
import Section3_Home from "./Section3_Home";
import Section4_Home from "./Section4_Home";

const Home = () => {
  return (
    <div className=" w-full mt-[8.3vh]">
      <Section1_Home />
      <Section2_Home />
      <Section3_Home />
      <Section4_Home />
    </div>
  );
};

export default Home;
