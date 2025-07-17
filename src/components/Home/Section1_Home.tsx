import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { IoStar } from "react-icons/io5";

import bgVideo from "../../assets/video/bg_vid.mp4";
import { Link } from "react-router-dom";

const Section1_Home = () => {
  return (
    <section className="relative h-[92vh] w-full overflow-hidden flex items-center justify-center">
      <video
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-10] border-none"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-[#e1d0a7] dark:bg-[#b18341] opacity-50 z-[-5]" />
      <div className=" w-[950px] h-[550px] flex flex-col items-center justify-between">
        <div className="bg-[#e1d0a7] dark:bg-[#331d15] px-5 py-2 h-min rounded-full">
          <p className="text-sm text-[#331d15] dark:text-[#e1d0a7]">
            Premium Coffee Experience
          </p>
        </div>
        <div className="flex flex-col items-center gap-0">
          <h1 className="text-4xl sm:text-4xl md:text-6xl lg:text-7xl   font-bold text-[#331d15] dark:text-[#e1d0a7]">
            Craft your Perfect
          </h1>
          <h2 className="text-6xl sm:text-6xl md:text-8xl lg:text-9xl   font-black text-[#331d15] dark:text-[#e1d0a7] ">
            Coffee Moment
          </h2>
        </div>
        <div>
          <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-medium text-[#331d15] dark:text-[#e1d0a7]">
            The finest coffee products delivered to your door.
          </p>
        </div>
        <div className="flex gap-5 flex-wrap w-full items-center justify-center">
          <Link to="/products">
            <button className="text-xl lg:text-2xl hover-scale cursor-pointer bg-gradient-to-r from-[#7a4e2e] to-[#e1d0a7] dark:from-[#e1d0a7] dark:to-[#7a4e2e] text-white dark:text-[#331d15] px-20 py-3 flex items-center justify-center gap-5 rounded-lg">
              Shop Now{" "}
              <FaArrowRight className="text-white dark:text-[#331d15]" />
            </button>
          </Link>

          <Link to="/about">
            <button className="text-xl lg:text-2xl hover-lift cursor-pointer hover:bg-[#331d15] dark:hover:bg-[#e1d0a7] hover:text-white dark:hover:text-[#331d15] bg-white dark:bg-[#331d15] text-black dark:text-[#e1d0a7] px-20 py-3 flex self-center justify-center rounded-lg ">
              Our Story
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-3 grid-rows-2 gap-2 h-[100px] w-full px-4 sm:px-0 max-w-[600px] mt-6">
          <div className="flex items-center justify-center text-2xl sm:text-3xl font-bold text-[#331d15] dark:text-[#e1d0a7]">
            10k+
          </div>
          <div className="flex items-center justify-center text-2xl sm:text-3xl font-bold text-[#331d15] dark:text-[#e1d0a7]">
            50+
          </div>
          <div className="flex items-center justify-center text-2xl sm:text-3xl font-bold text-[#331d15] dark:text-[#e1d0a7]">
            4.6 <IoStar />
          </div>
          <div className="flex items-center justify-center text-base sm:text-xl font-medium text-[#331d15] dark:text-[#e1d0a7]">
            Happy Customers
          </div>
          <div className="flex items-center justify-center text-base sm:text-xl font-medium text-[#331d15] dark:text-[#e1d0a7]">
            Coffee Varieties
          </div>
          <div className="flex items-center justify-center text-base sm:text-xl font-medium text-[#331d15] dark:text-[#e1d0a7]">
            Average Rating
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section1_Home;
