import React from "react";
import { FaFacebookF, FaShopify } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";

const Footer = () => {
  return (
    <div className="bg-[#f8f5ee] dark:bg-black p-6 md:p-8 lg:p-12 w-full min-h-[50vh]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <div className="lg:col-span-1">
          <div className="flex flex-row items-center gap-2 mb-4">
            <img src="/kape_logo.png" alt="kapekalakal" className="h-12 w-12" />
            <p className="font-black text-xl text-[#331d15] dark:text-white">
              KapeKalakal
            </p>
          </div>
          <p className="text-[#331d15] dark:text-white text-sm leading-relaxed">
            Crafting exceptional coffee experiences since 2020. From bean to
            cup, we deliver the finest quality coffee right to your doorstep.
          </p>
        </div>

        <div className="lg:col-span-1">
          <h3 className="font-bold text-[#331d15] dark:text-white mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <a
                href="/"
                className="text-[#331d15] dark:text-white hover:text-[#8B4513] transition-colors"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="text-[#331d15] dark:text-white hover:text-[#8B4513] transition-colors"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/products"
                className="text-[#331d15] dark:text-white hover:text-[#8B4513] transition-colors"
              >
                Products
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="text-[#331d15] dark:text-white hover:text-[#8B4513] transition-colors"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-1">
          <h3 className="font-bold text-[#331d15] dark:text-white mb-4">
            Customer Service
          </h3>
          <ul className="space-y-2">
            <li>
              <a
                href="/contact#contact-bottom"
                className="text-[#331d15] dark:text-white hover:text-[#8B4513] transition-colors"
              >
                Shipping Info
              </a>
            </li>
            <li>
              <a
                href="/contact#contact-bottom"
                className="text-[#331d15] dark:text-white hover:text-[#8B4513] transition-colors"
              >
                Returns
              </a>
            </li>
            <li>
              <a
                href="/contact#contact-bottom"
                className="text-[#331d15] dark:text-white hover:text-[#8B4513] transition-colors"
              >
                FAQ
              </a>
            </li>
            <li>
              <a
                href="/contact#contact-bottom"
                className="text-[#331d15] dark:text-white hover:text-[#8B4513] transition-colors"
              >
                Support
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-1">
          <h3 className="font-bold text-[#331d15] dark:text-white mb-4">
            Stay Connected
          </h3>
          <p className="text-[#331d15] dark:text-white text-sm mb-4 leading-relaxed">
            Subscribe to get updates on new blends and exclusive offers.
          </p>

          <div className="flex mb-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 border border-[#331d15] dark:text-white rounded-l-md text-[#331d15] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#331d15] text-white rounded-r-md hover:bg-[#8B4513] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:ring-offset-2"
            >
              <IoIosSend className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-3 mb-6">
            <a
              href="https://www.facebook.com/profile.php?id=100091268719455"
              target="_blank"
              className="p-2 bg-[#331d15] text-white rounded-full hover:bg-[#1877F2] transition-colors"
            >
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a
              href="https://www.lazada.com.ph/shop/kape-kalakal/"
              target="_blank"
              className="p-2 bg-[#331d15] text-white rounded-full hover:bg-[#FF6600] transition-colors"
            >
              <FaShopify className="w-4 h-4" />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
            <a
              href="#"
              className="text-[#331d15] dark:text-white hover:text-[#8B4513] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-[#331d15] dark:text-white hover:text-[#8B4513] transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#331d15] mt-8 pt-6">
        <p className="text-[#331d15] dark:text-white text-sm text-center">
          © 2024 KapeKalakal. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
