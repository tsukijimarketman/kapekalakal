import React from "react";
import { IoShieldOutline } from "react-icons/io5";
import { BsBagCheck } from "react-icons/bs";
import { TbTruckDelivery } from "react-icons/tb";

const Section3_Home = () => {
  return (
    <section className="h-auto w-full bg-[#cfb275] dark:bg-[#7a4e2e] flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10 gap-6 md:gap-8 lg:gap-10">
      <div className="w-full flex flex-col items-center gap-2">
        <p className="font-bold text-2xl sm:text-3xl md:text-4xl text-center text-[#331d15] dark:text-[#e1d0a7]">
          Why Choose Kape Kalakal
        </p>
        <p className="font-regular text-base sm:text-lg md:text-xl text-center max-w-2xl text-[#331d15] dark:text-[#e1d0a7]">
          We're committed to delivering the finest coffee experience
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 w-full max-w-7xl mx-auto">
        <div className="bg-[#dbc996] dark:bg-[#331d15] h-[250px] sm:h-[300px] md:h-[230px] lg:h-[250px] xl:h-[270px] border border-[#986836] dark:border-[#e1d0a7] rounded-2xl hover-lift transition-transform duration-300 hover:scale-105 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 bg-[#986836] dark:bg-[#e1d0a7] rounded-full flex items-center justify-center mb-4">
            <BsBagCheck className="text-white dark:text-[#331d15] text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-center mb-2 text-[#331d15] dark:text-[#e1d0a7]">
            Premium Quality
          </h3>
          <p className="text-sm text-center text-gray-700 dark:text-gray-300">
            Ethically sourced, expertly roasted coffee beans from around the
            world.
          </p>
        </div>
        <div className="bg-[#dbc996] dark:bg-[#331d15] h-[250px] sm:h-[300px] md:h-[230px] lg:h-[250px] xl:h-[270px] border border-[#986836] dark:border-[#e1d0a7] rounded-2xl hover-lift transition-transform duration-300 hover:scale-105 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 bg-[#986836] dark:bg-[#e1d0a7] rounded-full flex items-center justify-center mb-4">
            <TbTruckDelivery className="text-white dark:text-[#331d15] text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-center mb-2 text-[#331d15] dark:text-[#e1d0a7]">
            Fast Delivery
          </h3>
          <p className="text-sm text-center text-gray-700 dark:text-gray-300">
            Free shipping on orders over $50. Fresh coffee delivered to your
            door.
          </p>
        </div>
        <div className="bg-[#dbc996] dark:bg-[#331d15] h-[250px] sm:h-[300px] md:h-[230px] lg:h-[250px] xl:h-[270px] border border-[#986836] dark:border-[#e1d0a7] rounded-2xl hover-lift transition-transform duration-300 hover:scale-105 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 bg-[#986836] dark:bg-[#e1d0a7] rounded-full flex items-center justify-center mb-4">
            <IoShieldOutline className="text-white dark:text-[#331d15] text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-center mb-2 text-[#331d15] dark:text-[#e1d0a7]">
            Satisfaction Guaranteed
          </h3>
          <p className="text-sm text-center text-gray-700 dark:text-gray-300">
            30-day money-back guarantee. We stand behind our quality.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Section3_Home;
