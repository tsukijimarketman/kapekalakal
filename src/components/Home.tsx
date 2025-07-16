import React from "react";
import bgVideo from "../assets/video/bg_vid.mp4";
import sample1 from "../assets/images/sample1.png";
import sample2 from "../assets/images/sample2.png";
import sample3 from "../assets/images/sample3.png";
import sample4 from "../assets/images/sample4.png";
import { FaArrowRight, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { IoStar } from "react-icons/io5";

const Home = () => {
  return (
    <div className=" w-full mt-[8.3vh]">
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
          <div className="bg-[#e1d0a7] px-5 py-2 h-min rounded-full">
            <p className="text-sm">Premium Coffee Experience</p>
          </div>
          <div className="flex flex-col items-center gap-0">
            <h1 className="text-4xl sm:text-4xl md:text-6xl lg:text-7xl   font-bold text-[#331d15]">
              Craft your Perfect
            </h1>
            <h2 className="text-6xl sm:text-6xl md:text-8xl lg:text-9xl   font-black text-[#331d15] ">
              Coffee Moment
            </h2>
          </div>
          <div>
            <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-medium">
              The finest coffee products delivered to your door.
            </p>
          </div>
          <div className="flex gap-5 flex-wrap w-full items-center justify-center">
            <button className="text-xl lg:text-2xl hover-scale cursor-pointer bg-gradient-to-r from-[#7a4e2e] to-[#e1d0a7] text-white px-20 py-3 flex items-center justify-center gap-5 rounded-lg">
              Shop Now <FaArrowRight className="text-white" />
            </button>
            <button className="text-xl lg:text-2xl hover-lift cursor-pointer hover:bg-[#331d15] hover:text-white bg-white text-black px-20 py-3 flex self-center justify-center rounded-lg ">
              Our Story
            </button>
          </div>
          <div className="grid grid-cols-3 grid-rows-2 gap-2 h-[100px] w-full px-4 sm:px-0 max-w-[600px] mt-6">
            <div className="flex items-center justify-center text-2xl sm:text-3xl font-bold">
              10k+
            </div>
            <div className="flex items-center justify-center text-2xl sm:text-3xl font-bold">
              50+
            </div>
            <div className="flex items-center justify-center text-2xl sm:text-3xl font-bold">
              4.6 <IoStar />
            </div>
            <div className="flex items-center justify-center text-base sm:text-xl font-medium">
              Happy Customers
            </div>
            <div className="flex items-center justify-center text-base sm:text-xl font-medium">
              Coffee Varieties
            </div>
            <div className="flex items-center justify-center text-base sm:text-xl font-medium">
              Average Rating
            </div>
          </div>
        </div>
      </section>
      <section className="min-h-[90vh] w-full bg-[#e1d0a7] flex flex-col justify-between p-4 md:p-10">
        <div className="w-full flex flex-col items-center gap-2 mb-8">
          <p className="font-bold text-2xl md:text-4xl text-center">
            Featured Products
          </p>
          <p className="font-regular text-lg md:text-xl text-center max-w-2xl">
            Discover our most popular coffee blends and premium accessories
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-7xl">
            <div className="bg-[#cfb275] h-[400px] border border-[#986836] rounded-2xl hover-lift cursor-pointer transition-transform duration-300 hover:scale-105">
              <img
                src={sample2}
                alt="sampleproduct"
                className="h-[70%] w-full object-cover rounded-t-2xl"
              />
              <div className="p-4">
                <p className="text-lg font-bold">Premium Arabica Beans</p>
                <div className="flex gap-1 items-center">
                  <FaStar className="text-yellow-300" />
                  <FaStar className="text-yellow-300" />
                  <FaStar className="text-yellow-300" />
                  <FaStar className="text-yellow-300" />
                  <FaStarHalfAlt className="text-yellow-300" />
                  <span className="ml-1 text-sm">(4.5)</span>
                </div>
                <p className="text-xl font-semibold mt-2">₱ 299.99</p>
              </div>
            </div>

            <div className="bg-[#cfb275] h-[400px] border border-[#986836] rounded-2xl hover-lift cursor-pointer transition-transform duration-300 hover:scale-105">
              <img
                src={sample3}
                alt="sampleproduct"
                className="h-[70%] w-full object-cover rounded-t-2xl"
              />
              <div className="p-4">
                <p className="text-lg font-bold">Premium Arabica Beans</p>
                <div className="flex gap-1 items-center">
                  <FaStar className="text-yellow-300" />
                  <FaStar className="text-yellow-300" />
                  <FaStar className="text-yellow-300" />
                  <FaStar className="text-yellow-300" />
                  <FaStarHalfAlt className="text-yellow-300" />
                  <span className="ml-1 text-sm">(4.5)</span>
                </div>
                <p className="text-xl font-semibold mt-2">₱ 299.99</p>
              </div>
            </div>

            <div className="bg-[#cfb275] h-[400px] border border-[#986836] rounded-2xl hover-lift cursor-pointer transition-transform duration-300 hover:scale-105">
              <img
                src={sample4}
                alt="sampleproduct"
                className="h-[70%] w-full object-cover rounded-t-2xl"
              />
              <div className="p-4">
                <p className="text-lg font-bold">Premium Arabica Beans</p>
                <div className="flex gap-1 items-center">
                  <FaStar className="text-yellow-300" />
                  <FaStar className="text-yellow-300" />
                  <FaStar className="text-yellow-300" />
                  <FaStar className="text-yellow-300" />
                  <FaStarHalfAlt className="text-yellow-300" />
                  <span className="ml-1 text-sm">(4.5)</span>
                </div>
                <p className="text-xl font-semibold mt-2">₱ 299.99</p>
              </div>
            </div>

            <div className="bg-[#cfb275] h-[400px] border border-[#986836] rounded-2xl hover-lift cursor-pointer transition-transform duration-300 hover:scale-105">
              <img
                src={sample1}
                alt="sampleproduct"
                className="h-[70%] w-full object-cover rounded-t-2xl"
              />
              <div className="p-4">
                <p className="text-lg font-bold">Premium Arabica Beans</p>
                <div className="flex gap-1 items-center">
                  <FaStar className="text-yellow-300" />
                  <FaStar className="text-yellow-300" />
                  <FaStar className="text-yellow-300" />
                  <FaStar className="text-yellow-300" />
                  <FaStarHalfAlt className="text-yellow-300" />
                  <span className="ml-1 text-sm">(4.5)</span>
                </div>
                <div className="flex justify-between">
                  <p className="text-xl font-semibold mt-2">₱ 299.99</p>
                  <button className="bg-red-200 flex self-end">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-[60px] flex items-center justify-center">
          <button className="text-lg md:text-xl lg:text-2xl hover-scale cursor-pointer bg-gradient-to-r from-[#7a4e2e] to-[#e1d0a7] text-white px-8 md:px-20 py-3 flex items-center justify-center gap-3 md:gap-5 rounded-lg transition-transform duration-300 hover:scale-105">
            View All Products <FaArrowRight className="text-white" />
          </button>
        </div>
      </section>
      <section className="h-[70vh] w-full bg-[#cfb275] flex flex-col justify-between p-10 gap-10">
        <div className="w-full flex flex-col items-center gap-2">
          <p className="font-bold text-4xl">Why Choose Kape Kalakal</p>
          <p className="font-regular text-xl">
            We're committed to delivering the finest coffee experience
          </p>
        </div>
        <div className=" h-[400px] w-full flex justify-between">
          <div className="bg-[#cfb275] h-[70%] w-[28vw] border-1 border-[#986836] rounded-2xl hover-lift cursor-pointer"></div>
          <div className="bg-[#cfb275] h-[70%] w-[28vw] border-1 border-[#986836] rounded-2xl hover-lift cursor-pointer"></div>
          <div className="bg-[#cfb275] h-[70%] w-[28vw] border-1 border-[#986836] rounded-2xl hover-lift cursor-pointer"></div>
        </div>
      </section>
      <section className="h-[42vh] w-full bg-[#67412c]"></section>
    </div>
  );
};

export default Home;
