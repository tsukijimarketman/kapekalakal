import React from "react";

const Section4_Home = () => {
  return (
    <section className="h-[42vh] w-full bg-[#67412c] dark:bg-[#e1d0a7] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="w-full max-w-2xl flex flex-col items-center text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e1d0a7] dark:text-[#331d15] mb-4">
          Stay Caffeinated
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-[#cfb275] dark:text-[#7a4e2e] mb-8 max-w-xl">
          Subscribe to our newsletter for exclusive blends, brewing tips, and
          special offers.
        </p>
        <div className="w-full max-w-md flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg border border-[#986836] dark:border-[#331d15] bg-[#e1d0a7] dark:bg-[#331d15] text-[#331d15] dark:text-[#e1d0a7] placeholder-[#986836] dark:placeholder-[#cfb275] focus:outline-none focus:ring-2 focus:ring-[#cfb275] dark:focus:ring-[#e1d0a7] focus:border-transparent"
          />
          <button className="cursor-pointer px-6 py-3 bg-gradient-to-r from-[#7a4e2e] to-[#e1d0a7] dark:from-[#331d15] dark:to-[#7a4e2e] text-white dark:text-[#e1d0a7] rounded-lg hover:scale-105 transition-transform duration-300 font-medium">
            Subscribe Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Section4_Home;
