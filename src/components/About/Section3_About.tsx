import React from "react";
import { FaRegHeart } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { CiGlobe } from "react-icons/ci";
import { FiCoffee } from "react-icons/fi";

const Section3_About = () => {
  return (
    <section className="h-auto w-full bg-[#cfb275] dark:bg-[#331d15] flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10 gap-6 md:gap-8 lg:gap-10">
      <div className="w-full flex flex-col items-center gap-2">
        <p className="font-bold text-2xl sm:text-3xl md:text-4xl text-center text-black dark:text-[#f8f5ee]">
          Our Values
        </p>
        <p className="font-regular text-base sm:text-lg md:text-xl text-center max-w-2xl text-black dark:text-[#efe8d2]">
          The principles that guide everything we do
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 w-full max-w-7xl mx-auto">
        <div className="bg-[#dbc996] dark:bg-[#59382a] h-[250px] sm:h-[300px] md:h-[230px] lg:h-[250px] xl:h-[270px] border border-[#986836] dark:border-[#c0964f] rounded-2xl hover-lift  transition-transform duration-300 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 bg-[#986836] dark:bg-[#c0964f] rounded-full flex items-center justify-center mb-4">
            <FaRegHeart className="text-white text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-center mb-2 text-black dark:text-[#f8f5ee]">
            Passion for Quality
          </h3>
          <p className="text-sm text-center text-gray-700 dark:text-[#efe8d2]">
            Every bean is carefully selected and roasted to perfection, ensuring
            exceptional taste in every cup
          </p>
        </div>
        <div className="bg-[#dbc996] dark:bg-[#59382a] h-[250px] sm:h-[300px] md:h-[230px] lg:h-[250px] xl:h-[270px] border border-[#986836] dark:border-[#c0964f] rounded-2xl hover-lift  transition-transform duration-300 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 bg-[#986836] dark:bg-[#c0964f] rounded-full flex items-center justify-center mb-4">
            <MdGroups className="text-white text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-center mb-2 text-black dark:text-[#f8f5ee]">
            Community First
          </h3>
          <p className="text-sm text-center text-gray-700 dark:text-[#efe8d2]">
            We support local communities and fair trade practices, creating
            positive impact through coffee.
          </p>
        </div>
        <div className="bg-[#dbc996] dark:bg-[#59382a] h-[250px] sm:h-[300px] md:h-[230px] lg:h-[250px] xl:h-[270px] border border-[#986836] dark:border-[#c0964f] rounded-2xl hover-lift  transition-transform duration-300 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 bg-[#986836] dark:bg-[#c0964f] rounded-full flex items-center justify-center mb-4">
            <CiGlobe className="text-white text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-center mb-2 text-black dark:text-[#f8f5ee]">
            Sustainable Sourcing
          </h3>
          <p className="text-sm text-center text-gray-700 dark:text-[#efe8d2]">
            Environmental responsibility guides our sourcing decisions,
            protecting the planet for future generations.
          </p>
        </div>
        <div className="bg-[#dbc996] dark:bg-[#59382a] h-[250px] sm:h-[300px] md:h-[230px] lg:h-[250px] xl:h-[270px] border border-[#986836] dark:border-[#c0964f] rounded-2xl hover-lift  transition-transform duration-300 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 bg-[#986836] dark:bg-[#c0964f] rounded-full flex items-center justify-center mb-4">
            <FiCoffee className="text-white text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-center mb-2 text-black dark:text-[#f8f5ee]">
            Craftsmanship
          </h3>
          <p className="text-sm text-center text-gray-700 dark:text-[#efe8d2]">
            Traditional roasting methods combined with modern techniques create
            our signature flavor profiles.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Section3_About;
