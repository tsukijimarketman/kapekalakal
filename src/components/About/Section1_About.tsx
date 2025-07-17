import React from "react";

const Section1_About = () => {
  return (
    <section className="w-full h-[300px] bg-[#e1d0a7] dark:bg-[#331d15] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="w-full max-w-3xl flex flex-col items-center text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#331d15] dark:text-[#f8f5ee] mb-4">
          Our Story
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-[#67412c] dark:text-[#efe8d2] max-w-2xl leading-relaxed">
          Founded in 2020 with a simple mission: to bring the world's finest
          coffee directly to your cup. We believe that great coffee connects
          people, cultures, and communities.
        </p>
      </div>
    </section>
  );
};

export default Section1_About;
