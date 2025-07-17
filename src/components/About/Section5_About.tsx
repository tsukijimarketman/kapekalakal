import React from "react";

const Section5_About = () => {
  return (
    <section className="w-full h-[300px] bg-[#342316] dark:bg-[#b18341] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="w-full max-w-3xl flex flex-col items-center text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e9e0bf] dark:text-[#331d15] mb-4">
          Our Mission
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-[#e9e0bf] dark:text-[#59382a] max-w-2xl leading-relaxed">
          "To create meaningful connections through exceptional coffee
          experiences, supporting sustainable practices and fair trade while
          bringing the world's finest flavors to your daily ritual."
        </p>
      </div>
    </section>
  );
};

export default Section5_About;
