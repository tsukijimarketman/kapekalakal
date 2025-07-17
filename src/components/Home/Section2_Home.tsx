import React from "react";
import sample1 from "../../assets/images/sample1.png";
import sample2 from "../../assets/images/sample2.png";
import sample3 from "../../assets/images/sample3.png";
import sample4 from "../../assets/images/sample4.png";
import { FaArrowRight, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Section2_Home = () => {
  return (
    <section className="min-h-[90vh] w-full bg-[#e1d0a7] dark:bg-[#331d15] flex flex-col justify-between p-4 md:p-10">
      <div className="w-full flex flex-col items-center gap-2 mb-8">
        <p className="font-bold text-2xl md:text-4xl text-center text-[#331d15] dark:text-[#e1d0a7]">
          Featured Products
        </p>
        <p className="font-regular text-lg md:text-xl text-center max-w-2xl text-[#331d15] dark:text-[#e1d0a7]">
          Discover our most popular coffee blends and premium accessories
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-7xl">
          <div className="group bg-[#cfb275] dark:bg-[#7a4e2e] h-[400px] border border-[#986836] dark:border-[#e1d0a7] rounded-2xl hover-lift cursor-pointer transition-transform duration-300 hover:scale-105">
            <img
              src={sample2}
              alt="sampleproduct"
              className="h-[70%] w-full object-cover rounded-t-2xl"
            />
            <div className="p-4">
              <p className="text-lg font-bold text-[#331d15] dark:text-[#e1d0a7]">
                Premium Arabica Beans
              </p>
              <div className="flex gap-1 items-center">
                <FaStar className="text-yellow-300" />
                <FaStar className="text-yellow-300" />
                <FaStar className="text-yellow-300" />
                <FaStar className="text-yellow-300" />
                <FaStarHalfAlt className="text-yellow-300" />
                <span className="ml-1 text-sm text-[#331d15] dark:text-[#e1d0a7]">
                  (4.5)
                </span>
              </div>
              <div className="flex justify-between">
                <p className="text-xl font-semibold mt-2 text-[#331d15] dark:text-[#e1d0a7]">
                  ₱ 299.99
                </p>
                <button className="cursor-pointer hover-scale hidden group-hover:flex bg-[#986836] dark:bg-[#e1d0a7] hover:flex self-end px-3 py-1 rounded-full text-white dark:text-[#331d15]">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <div className="group bg-[#cfb275] dark:bg-[#7a4e2e] h-[400px] border border-[#986836] dark:border-[#e1d0a7] rounded-2xl hover-lift cursor-pointer transition-transform duration-300 hover:scale-105">
            <img
              src={sample3}
              alt="sampleproduct"
              className="h-[70%] w-full object-cover rounded-t-2xl"
            />
            <div className="p-4">
              <p className="text-lg font-bold text-[#331d15] dark:text-[#e1d0a7]">
                Premium Arabica Beans
              </p>
              <div className="flex gap-1 items-center">
                <FaStar className="text-yellow-300" />
                <FaStar className="text-yellow-300" />
                <FaStar className="text-yellow-300" />
                <FaStar className="text-yellow-300" />
                <FaStarHalfAlt className="text-yellow-300" />
                <span className="ml-1 text-sm text-[#331d15] dark:text-[#e1d0a7]">
                  (4.5)
                </span>
              </div>
              <div className="flex justify-between">
                <p className="text-xl font-semibold mt-2 text-[#331d15] dark:text-[#e1d0a7]">
                  ₱ 299.99
                </p>
                <button className="cursor-pointer hover-scale hidden group-hover:flex bg-[#986836] dark:bg-[#e1d0a7] hover:flex self-end px-3 py-1 rounded-full text-white dark:text-[#331d15]">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <div className="group bg-[#cfb275] dark:bg-[#7a4e2e] h-[400px] border border-[#986836] dark:border-[#e1d0a7] rounded-2xl hover-lift cursor-pointer transition-transform duration-300 hover:scale-105">
            <img
              src={sample4}
              alt="sampleproduct"
              className="h-[70%] w-full object-cover rounded-t-2xl"
            />
            <div className="p-4">
              <p className="text-lg font-bold text-[#331d15] dark:text-[#e1d0a7]">
                Premium Arabica Beans
              </p>
              <div className="flex gap-1 items-center">
                <FaStar className="text-yellow-300" />
                <FaStar className="text-yellow-300" />
                <FaStar className="text-yellow-300" />
                <FaStar className="text-yellow-300" />
                <FaStarHalfAlt className="text-yellow-300" />
                <span className="ml-1 text-sm text-[#331d15] dark:text-[#e1d0a7]">
                  (4.5)
                </span>
              </div>
              <div className="flex justify-between">
                <p className="text-xl font-semibold mt-2 text-[#331d15] dark:text-[#e1d0a7]">
                  ₱ 299.99
                </p>
                <button className="cursor-pointer hover-scale hidden group-hover:flex bg-[#986836] dark:bg-[#e1d0a7] hover:flex self-end px-3 py-1 rounded-full text-white dark:text-[#331d15]">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <div className="group bg-[#cfb275] dark:bg-[#7a4e2e] h-[400px] border border-[#986836] dark:border-[#e1d0a7] rounded-2xl hover-lift cursor-pointer transition-transform duration-300 hover:scale-105">
            <img
              src={sample1}
              alt="sampleproduct"
              className="h-[70%] w-full object-cover rounded-t-2xl"
            />
            <div className="p-4">
              <p className="text-lg font-bold text-[#331d15] dark:text-[#e1d0a7]">
                Premium Arabica Beans
              </p>
              <div className="flex gap-1 items-center">
                <FaStar className="text-yellow-300" />
                <FaStar className="text-yellow-300" />
                <FaStar className="text-yellow-300" />
                <FaStar className="text-yellow-300" />
                <FaStarHalfAlt className="text-yellow-300" />
                <span className="ml-1 text-sm text-[#331d15] dark:text-[#e1d0a7]">
                  (4.5)
                </span>
              </div>
              <div className="flex justify-between">
                <p className="text-xl font-semibold mt-2 text-[#331d15] dark:text-[#e1d0a7]">
                  ₱ 299.99
                </p>
                <button className="cursor-pointer hover-scale hidden group-hover:flex bg-[#986836] dark:bg-[#e1d0a7] hover:flex self-end px-3 py-1 rounded-full text-white dark:text-[#331d15]">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[60px] flex items-center justify-center">
        <Link to="/products">
          <button className="text-lg md:text-xl lg:text-2xl hover-scale cursor-pointer bg-gradient-to-r from-[#7a4e2e] to-[#e1d0a7] dark:from-[#e1d0a7] dark:to-[#7a4e2e] text-white dark:text-[#331d15] px-8 md:px-20 py-3 flex items-center justify-center gap-3 md:gap-5 rounded-lg transition-transform duration-300 hover:scale-105">
            View All Products{" "}
            <FaArrowRight className="text-white dark:text-[#331d15]" />
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Section2_Home;
