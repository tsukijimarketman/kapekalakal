import React, { useEffect, useState } from "react";
import { FiSun } from "react-icons/fi";
import { LuShoppingCart, LuMoon } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? true
      : false;
  });

  useEffect(() => {
    const html = document.documentElement;

    if (darkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="fixed top-0 left-0 z-50 bg-[#f8f5ee] dark:bg-black w-full h-[8.3vh] px-[3vw] py-[10px] flex flex-row justify-between items-center transition-colors duration-300">
      <div className="flex flex-row items-center gap-2 cursor-pointer">
        <img src="/kape_logo.png" alt="kapekalakal" className="h-[5.05vh]" />
        <p className="font-black text-xl text-[#331d15] dark:text-white">
          KapeKalakal
        </p>
      </div>

      <div className="hidden lg:flex h-full w-auto gap-10 flex-initial flex-row items-center justify-between">
        <Link
          to="/"
          className={`text-sm font-semibold ${
            isActive("/")
              ? "text-[#b08342]"
              : "text-gray-500 hover:text-[#b08342]"
          }`}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={`text-sm font-semibold ${
            isActive("/about")
              ? "text-[#b08342]"
              : "text-gray-500 hover:text-[#b08342]"
          }`}
        >
          About
        </Link>
        <Link
          to="/products"
          className={`text-sm font-semibold ${
            isActive("/products")
              ? "text-[#b08342]"
              : "text-gray-500 hover:text-[#b08342]"
          }`}
        >
          Products
        </Link>
        <Link
          to="/contact"
          className={`text-sm font-semibold ${
            isActive("/contact")
              ? "text-[#b08342]"
              : "text-gray-500 hover:text-[#b08342]"
          }`}
        >
          Contact
        </Link>
      </div>

      <div className="hidden lg:flex h-full w-auto flex-row items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="bg-transparent hover:bg-[#debe7ee4] text-black px-3 py-3 rounded transition-colors duration-300 ease-in-out cursor-pointer"
        >
          {darkMode ? (
            <LuMoon className="text-white" />
          ) : (
            <FiSun className="text-black" />
          )}
        </button>
        <Link to="/signin">
          <button className="bg-transparent hover:bg-[#debe7ee4] text-sm text-black dark:text-white px-4.5 py-2.5 rounded transition-colors duration-300 ease-in-out cursor-pointer">
            Sign In
          </button>
        </Link>
        <Link to="/signup">
          <button className="bg-[#986836] dark:bg-[#cfb175] hover-lift hover:bg-[#b08342]  text-sm text-white dark:text-black px-4.5 py-2.5 rounded transition-colors duration-300 ease-in-out cursor-pointer">
            Sign Up
          </button>
        </Link>
        <button className="bg-transparent hover:bg-[#debe7ee4] text-black dark:text-white px-3 py-3 rounded transition-colors duration-300 ease-in-out cursor-pointer">
          <LuShoppingCart />
        </button>
      </div>

      <div className="flex lg:hidden h-full flex-row items-center gap-2">
        <button className="bg-transparent hover:bg-[#debe7ee4] dark:text-white text-black px-3 py-3 rounded transition-colors duration-300 ease-in-out">
          <LuShoppingCart />
        </button>
        <button
          onClick={toggleMenu}
          className="bg-transparent hover:bg-[#debe7ee4] dark:text-white text-black px-3 py-3 rounded transition-colors duration-300 ease-in-out"
        >
          <RxHamburgerMenu />
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden absolute top-[8.3vh] left-0 w-full bg-white dark:bg-black shadow-md py-4 px-6 flex flex-col gap-4 z-40 animate-slide-down">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-semibold text-black dark:text-white hover:text-[#b08342]"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-semibold text-black dark:text-white hover:text-[#b08342]"
          >
            About
          </Link>
          <Link
            to="/products"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-semibold text-black dark:text-white hover:text-[#b08342]"
          >
            Products
          </Link>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-semibold text-black dark:text-white hover:text-[#b08342]"
          >
            Contact
          </Link>
          <button className="text-sm text-black dark:text-white hover:text-[#b08342] text-left">
            Sign In
          </button>
          <button className="text-sm text-black dark:text-white hover:text-[#b08342] text-left">
            Sign Up
          </button>
          <button
            onClick={toggleDarkMode}
            className="text-left text-black dark:text-white hover:text-[#b08342]"
          >
            {darkMode ? (
              <span className="flex items-center gap-2">
                <LuMoon /> Dark Mode
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FiSun /> Light Mode
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
