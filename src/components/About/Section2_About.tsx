import React from "react";
import aboutBg from "../../assets/images/about_bg.jpg";

const Section2_About = () => {
  return (
    <section className="relative w-full h-[80vh] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat z-[-10]"
        style={{
          backgroundImage: `url(${aboutBg})`,
        }}
      />

      <div className="absolute top-0 left-0 w-full h-full bg-[#e1d0a7] dark:bg-[#331d15] opacity-70 dark:opacity-80 z-[-5]" />

      <div className="w-full max-w-4xl flex flex-col items-center text-center z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#331d15] dark:text-[#f8f5ee] mb-6">
          The Journey Begins
        </h2>
        <div className="space-y-4 text-base sm:text-lg md:text-2xl text-[#000] dark:text-[#efe8d2] max-w-3xl leading-relaxed">
          <p>
            It started with a simple cup of coffee in a small café in Makati.
            Our founder was amazed by the complexity and richness of flavors
            that could be found in a single bean. This moment sparked a passion
            that would eventually become kape kalakal.
          </p>
          <p>
            Today, we work directly with farmers from around the world, ensuring
            fair trade practices while bringing you the most exceptional coffee
            experience possible. Every bag tells a story of dedication,
            craftsmanship, and the pursuit of perfection.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Section2_About;
