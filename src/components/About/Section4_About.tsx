import React from "react";
import pfp1 from "../../assets/images/pfp.png";
import pfp2 from "../../assets/images/pfp2.jpg";

const Section4_About = () => {
  return (
    <section className="h-auto w-full bg-[#e9e0bf] dark:bg-[#67412c] flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10 gap-6 md:gap-8 lg:gap-10">
      <div className="w-full flex flex-col items-center gap-2">
        <p className="font-bold text-2xl sm:text-3xl md:text-4xl text-center text-black dark:text-[#f8f5ee]">
          Meet Our Team
        </p>
        <p className="font-regular text-base sm:text-lg md:text-xl text-center max-w-2xl text-black dark:text-[#efe8d2]">
          The passionate people behind your perfect cup
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 md:gap-8 lg:gap-10 w-full max-w-4xl mx-auto justify-center">
        <div className="bg-[#dbc996] dark:bg-[#59382a] border border-[#986836] dark:border-[#c0964f] rounded-2xl hover-lift cursor-pointer transition-transform duration-300 hover:scale-105 flex flex-col items-center justify-center p-6 sm:p-8 flex-1">
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 border-4 border-[#986836] dark:border-[#c0964f]">
            <img
              src={pfp1}
              alt="Gerick M. Velasquez"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-center mb-2 text-black dark:text-[#f8f5ee]">
            Gerick M. Velasquez
          </h3>
          <p className="text-base sm:text-lg font-semibold text-center mb-2 text-[#986836] dark:text-[#c0964f]">
            Master Baiter
          </p>
          <p className="text-sm sm:text-base text-center text-gray-700 dark:text-[#efe8d2]">
            15+ Years of experience in Coffee Baiting
          </p>
        </div>
        <div className="bg-[#dbc996] dark:bg-[#59382a] border border-[#986836] dark:border-[#c0964f] rounded-2xl hover-lift cursor-pointer transition-transform duration-300 hover:scale-105 flex flex-col items-center justify-center p-6 sm:p-8 flex-1">
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 border-4 border-[#986836] dark:border-[#c0964f]">
            <img
              src={pfp2}
              alt="Geneva M. Velasquez"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-center mb-2 text-black dark:text-[#f8f5ee]">
            Geneva M. Velasquez
          </h3>
          <p className="text-base sm:text-lg font-semibold text-center mb-2 text-[#986836] dark:text-[#c0964f]">
            Quality Control
          </p>
          <p className="text-sm sm:text-base text-center text-gray-700 dark:text-[#efe8d2]">
            Ensures every batch meets our standards
          </p>
        </div>
      </div>
    </section>
  );
};

export default Section4_About;
