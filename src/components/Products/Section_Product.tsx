import React from "react";
import { FaSearch, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import sample1 from "../../assets/images/sample1.png";
import sample2 from "../../assets/images/sample2.png";
import sample3 from "../../assets/images/sample3.png";
import sample4 from "../../assets/images/sample4.png";

const Section_Product = () => {
  return (
    <section className="h-auto w-full flex flex-col">
      {/* Hero Section - Responsive padding and text sizes */}
      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] bg-[#e1d0a7] dark:bg-[#331d15] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="w-full max-w-3xl flex flex-col items-center text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#331d15] dark:text-[#e1d0a7] mb-2 sm:mb-4">
            Our Products
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#67412c] dark:text-[#e1d0a7] max-w-2xl leading-relaxed px-2">
            Discover our carefully curated selection of premium coffee, tea, and
            brewing equipment
          </p>
        </div>
      </div>

      {/* Main Content Section - Responsive padding */}
      <div className="bg-[#efe8d2] dark:bg-[#331d15] flex flex-col px-4 sm:px-6 md:px-12 lg:px-20 py-5 gap-6 md:gap-10">
        {/* Search and Filter Section - Stack on mobile */}
        <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between items-center">
          {/* Search Bar - Full width on mobile */}
          <div className="border border-gray-400 w-full sm:w-[250px] md:w-[300px] h-[40px] rounded-md flex items-center bg-white">
            <div className="w-[50px] flex items-center justify-center text-gray-500">
              <FaSearch />
            </div>
            <input
              type="text"
              placeholder="Search products"
              className="w-full h-full outline-none bg-transparent px-2 text-gray-700 "
            />
          </div>

          {/* Filter Buttons - Responsive layout */}
          <div className="w-full sm:w-auto flex flex-wrap sm:flex-nowrap justify-center sm:justify-end gap-2">
            <button className="cursor-pointer px-2 py-1 sm:px-3 sm:py-2 hover:scale-105 transition-transform flex items-center justify-center gap-1 border border-gray-400 rounded-md bg-white  hover:bg-gray-100  text-xs sm:text-sm">
              <FiFilter className="text-xs sm:text-sm" />
              <span>All</span>
            </button>
            <button className="cursor-pointer px-2 py-1 sm:px-3 sm:py-2 hover:scale-105 transition-transform flex items-center justify-center gap-1 border border-gray-400 rounded-md bg-white  hover:bg-gray-100  text-xs sm:text-sm">
              <FiFilter className="text-xs sm:text-sm" />
              <span>Coffee</span>
            </button>
            <button className="cursor-pointer px-2 py-1 sm:px-3 sm:py-2 hover:scale-105 transition-transform flex items-center justify-center gap-1 border border-gray-400 rounded-md bg-white  hover:bg-gray-100  text-xs sm:text-sm">
              <FiFilter className="text-xs sm:text-sm" />
              <span>Tea</span>
            </button>
            <button className="cursor-pointer px-2 py-1 sm:px-3 sm:py-2 hover:scale-105 transition-transform flex items-center justify-center gap-1 border border-gray-400 rounded-md bg-white  hover:bg-gray-100  text-xs sm:text-sm">
              <FiFilter className="text-xs sm:text-sm" />
              <span>Equipment</span>
            </button>
            <button className="cursor-pointer px-2 py-1 sm:px-3 sm:py-2 hover:scale-105 transition-transform flex items-center justify-center gap-1 border border-gray-400 rounded-md bg-white  hover:bg-gray-100  text-xs sm:text-sm">
              <FiFilter className="text-xs sm:text-sm" />
              <span>Accessories</span>
            </button>
          </div>
        </div>

        {/* Products Grid - Responsive grid layout */}
        <div className="flex-1 flex items-center justify-center mb-4 md:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 w-full max-w-7xl">
            {/* Product Card 1 */}
            <div className="group bg-[#cfb275] dark:bg-[#7a4e2e] h-[350px] sm:h-[380px] md:h-[400px] border border-[#986836] dark:border-[#e1d0a7] rounded-2xl hover:scale-105 transition-transform duration-300 cursor-pointer">
              <img
                src={sample2}
                alt="Premium Arabica Beans"
                className="h-[60%] sm:h-[65%] md:h-[70%] w-full object-cover rounded-t-2xl"
              />
              <div className="p-3 sm:p-4 h-[40%] sm:h-[35%] md:h-[30%] flex flex-col justify-between">
                <div>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-[#331d15] dark:text-[#e1d0a7] mb-1 sm:mb-2">
                    Premium Arabica Beans
                  </p>
                  <div className="flex gap-1 items-center mb-2">
                    <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                    <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                    <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                    <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                    <FaStarHalfAlt className="text-yellow-400 text-xs sm:text-sm" />
                    <span className="ml-1 text-xs sm:text-sm text-[#331d15] dark:text-[#e1d0a7]">
                      (4.5)
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-lg sm:text-xl font-semibold text-[#331d15] dark:text-[#e1d0a7]">
                    ₱ 299.99
                  </p>
                  <button className="opacity-0 group-hover:opacity-100 sm:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 bg-[#986836] dark:bg-[#e1d0a7] hover:scale-105 px-2 sm:px-3 py-1 rounded-full text-white dark:text-[#331d15] text-xs sm:text-sm font-medium">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="group bg-[#cfb275] dark:bg-[#7a4e2e] h-[350px] sm:h-[380px] md:h-[400px] border border-[#986836] dark:border-[#e1d0a7] rounded-2xl hover:scale-105 transition-transform duration-300 cursor-pointer">
              <img
                src={sample3}
                alt="Premium Tea Blend"
                className="h-[60%] sm:h-[65%] md:h-[70%] w-full object-cover rounded-t-2xl"
              />
              <div className="p-3 sm:p-4 h-[40%] sm:h-[35%] md:h-[30%] flex flex-col justify-between">
                <div>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-[#331d15] dark:text-[#e1d0a7] mb-1 sm:mb-2">
                    Premium Tea Blend
                  </p>
                  <div className="flex gap-1 items-center mb-2">
                    <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                    <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                    <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                    <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                    <FaStarHalfAlt className="text-yellow-400 text-xs sm:text-sm" />
                    <span className="ml-1 text-xs sm:text-sm text-[#331d15] dark:text-[#e1d0a7]">
                      (4.5)
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-lg sm:text-xl font-semibold text-[#331d15] dark:text-[#e1d0a7]">
                    ₱ 249.99
                  </p>
                  <button className="opacity-0 group-hover:opacity-100 sm:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 bg-[#986836] dark:bg-[#e1d0a7] hover:scale-105 px-2 sm:px-3 py-1 rounded-full text-white dark:text-[#331d15] text-xs sm:text-sm font-medium">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="group bg-[#cfb275] dark:bg-[#7a4e2e] h-[350px] sm:h-[380px] md:h-[400px] border border-[#986836] dark:border-[#e1d0a7] rounded-2xl hover:scale-105 transition-transform duration-300 cursor-pointer">
              <img
                src={sample4}
                alt="Coffee Equipment"
                className="h-[60%] sm:h-[65%] md:h-[70%] w-full object-cover rounded-t-2xl"
              />
              <div className="p-3 sm:p-4 h-[40%] sm:h-[35%] md:h-[30%] flex flex-col justify-between">
                <div>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-[#331d15] dark:text-[#e1d0a7] mb-1 sm:mb-2">
                    Coffee Equipment
                  </p>
                  <div className="flex gap-1 items-center mb-2">
                    <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                    <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                    <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                    <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                    <FaStarHalfAlt className="text-yellow-400 text-xs sm:text-sm" />
                    <span className="ml-1 text-xs sm:text-sm text-[#331d15] dark:text-[#e1d0a7]">
                      (4.5)
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-lg sm:text-xl font-semibold text-[#331d15] dark:text-[#e1d0a7]">
                    ₱ 1,299.99
                  </p>
                  <button className="opacity-0 group-hover:opacity-100 sm:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 bg-[#986836] dark:bg-[#e1d0a7] hover:scale-105 px-2 sm:px-3 py-1 rounded-full text-white dark:text-[#331d15] text-xs sm:text-sm font-medium">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Product Card 4 */}
            <div className="group bg-[#cfb275] dark:bg-[#7a4e2e] h-[350px] sm:h-[380px] md:h-[400px] border border-[#986836] dark:border-[#e1d0a7] rounded-2xl hover:scale-105 transition-transform duration-300 cursor-pointer">
              <img
                src={sample1}
                alt="Coffee Accessories"
                className="h-[60%] sm:h-[65%] md:h-[70%] w-full object-cover rounded-t-2xl"
              />
              <div className="p-3 sm:p-4 h-[40%] sm:h-[35%] md:h-[30%] flex flex-col justify-between">
                <div>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-[#331d15] dark:text-[#e1d0a7] mb-1 sm:mb-2">
                    Coffee Accessories
                  </p>
                  <div className="flex gap-1 items-center mb-2">
                    <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                    <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                    <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                    <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                    <FaStarHalfAlt className="text-yellow-400 text-xs sm:text-sm" />
                    <span className="ml-1 text-xs sm:text-sm text-[#331d15] dark:text-[#e1d0a7]">
                      (4.5)
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-lg sm:text-xl font-semibold text-[#331d15] dark:text-[#e1d0a7]">
                    ₱ 149.99
                  </p>
                  <button className="opacity-0 group-hover:opacity-100 sm:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 bg-[#986836] dark:bg-[#e1d0a7] hover:scale-105 px-2 sm:px-3 py-1 rounded-full text-white dark:text-[#331d15] text-xs sm:text-sm font-medium">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section_Product;
