import React from "react";
import { CiMail } from "react-icons/ci";
import { IoCallOutline, IoLocationOutline } from "react-icons/io5";
import { MdAccessTime } from "react-icons/md";

const Section2_Contact = () => {
  return (
    <section className="w-full bg-[#f5f1df] dark:bg-[#331d15] flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10 gap-6 md:gap-8 lg:gap-10">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 w-full max-w-7xl mx-auto">
        <div className="bg-[#dbc996] dark:bg-[#59382a] h-[250px] sm:h-[300px] md:h-[230px] lg:h-[250px] xl:h-[270px] border border-[#986836] dark:border-[#7a4e2e] rounded-2xl hover-lift  transition-transform duration-300 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 bg-[#986836] dark:bg-[#67412c] rounded-full flex items-center justify-center mb-4">
            <IoLocationOutline className="text-white text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-center mb-2 text-black dark:text-[#f8f5ee]">
            <a
              href="https://www.google.com/maps/place/2841+Martinez+Unidos,+Makati+City,+1205+Metro+Manila/@14.567187,121.0142029,17z/data=!3m1!4b1!4m6!3m5!1s0x3397c9a6d1bf34e5:0x965d7b53036678e2!8m2!3d14.567187!4d121.0167778!16s%2Fg%2F11kgxdsdpl?entry=ttu&g_ep=EgoyMDI1MDYzMC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
            >
              2841 Martinez Unidos Sta Cruz Makati City, Metro Manila
            </a>
          </h3>
          <p className="text-sm text-center text-gray-700 dark:text-[#efe8d2]">
            Visit Our Roastery, we are open for tours and tastings
          </p>
        </div>
        <div className="bg-[#dbc996] dark:bg-[#59382a] h-[250px] sm:h-[300px] md:h-[230px] lg:h-[250px] xl:h-[270px] border border-[#986836] dark:border-[#7a4e2e] rounded-2xl hover-lift  transition-transform duration-300 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 bg-[#986836] dark:bg-[#67412c] rounded-full flex items-center justify-center mb-4">
            <IoCallOutline className="text-white text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-center mb-2 text-black dark:text-[#f8f5ee]">
            <a href="tel:+639919382645" target="_blank">
              +63 919 382 645
            </a>
          </h3>
          <p className="text-sm text-center text-gray-700 dark:text-[#efe8d2]">
            Call Us Monday - Friday, 8AM - 6PM
          </p>
        </div>
        <div className="bg-[#dbc996] dark:bg-[#59382a] h-[250px] sm:h-[300px] md:h-[230px] lg:h-[250px] xl:h-[270px] border border-[#986836] dark:border-[#7a4e2e] rounded-2xl hover-lift  transition-transform duration-300 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 bg-[#986836] dark:bg-[#67412c] rounded-full flex items-center justify-center mb-4">
            <CiMail className="text-white text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-center mb-2 text-black dark:text-[#f8f5ee]">
            <a href="mailto:gmvelasquez@sscgi.com" target="_blank">
              gmvelasquez@sscgi.com
            </a>
          </h3>
          <p className="text-sm text-center text-gray-700 dark:text-[#efe8d2]">
            We respond within 24 hours
          </p>
        </div>
        <div className="bg-[#dbc996] dark:bg-[#59382a] h-[250px] sm:h-[300px] md:h-[230px] lg:h-[250px] xl:h-[270px] border border-[#986836] dark:border-[#555555] rounded-2xl hover-lift  transition-transform duration-300 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 bg-[#986836] dark:bg-[#67412c] rounded-full flex items-center justify-center mb-4">
            <MdAccessTime className="text-white text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-center mb-2 text-black dark:text-white">
            Mon-Fri: 8AM-6PM
          </h3>
          <p className="text-sm text-center text-gray-700 dark:text-gray-300">
            Business Hours Sat-Sun: 9AM-5PM
          </p>
        </div>
      </div>
    </section>
  );
};

export default Section2_Contact;
