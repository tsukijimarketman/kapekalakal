import React, { useEffect, useState } from "react";
import {
  FaShoppingBag,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

import All from "./tabs/All";
import ToPay from "./tabs/ToPay";
import ToReceive from "./tabs/ToReceive";
import InTransit from "./tabs/InTransit";
import Completed from "./tabs/Completed";
import Cancelled from "./tabs/Cancelled";

const UserPanel = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeOrderTab, setActiveOrderTab] = useState("All");

  const orderTabs = [
    { name: "All" },
    { name: "To Pay" },
    { name: "To Receive" },
    { name: "In Transit" },
    { name: "Completed" },
    { name: "Cancelled" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const goback = () => {
    navigate("/user");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      <div className="min-h-screen bg-[#f9f6ed] dark:bg-[#59382a] text-[#59382a] dark:text-[#f9f6ed]">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-[#efe8d2] dark:bg-[#67412c] border-b border-[#e1d0a7] dark:border-[#7a4e2e]">
          <h1 className="text-xl font-bold text-[#7a4e2e] dark:text-[#e1d0a7]">
            My Account
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="cursor-pointer p-2 rounded-lg bg-[#e1d0a7] dark:bg-[#7a4e2e] text-[#996936] dark:text-[#e1d0a7] hover:bg-[#d0b274] dark:hover:bg-[#996936] transition-colors duration-200"
            >
              {darkMode ? <FaMoon size={20} /> : <FaSun size={20} />}
            </button>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg bg-[#e1d0a7] dark:bg-[#7a4e2e] text-[#7a4e2e] dark:text-[#e1d0a7] hover:bg-[#d0b274] dark:hover:bg-[#996936] transition-colors duration-200"
            >
              {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        <div className="flex">
          {/* Fixed Sidebar */}
          <div
            className={`
            fixed top-0 left-0 z-40 w-64 h-screen transform transition-transform duration-300 ease-in-out flex flex-col
            ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
            bg-[#efe8d2] dark:bg-[#67412c] border-r border-[#e1d0a7] dark:border-[#7a4e2e]
          `}
          >
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between p-6 border-b border-[#e1d0a7] dark:border-[#7a4e2e] flex-shrink-0">
              <h1 className="text-xl font-bold text-[#7a4e2e] dark:text-[#e1d0a7]">
                My Account
              </h1>
              <button
                onClick={toggleDarkMode}
                className="cursor-pointer p-2 rounded-lg bg-[#e1d0a7] dark:bg-[#7a4e2e] text-[#996936] dark:text-[#e1d0a7] hover:bg-[#d0b274] dark:hover:bg-[#996936] transition-colors duration-200"
              >
                {darkMode ? <FaMoon size={20} /> : <FaSun size={20} />}
              </button>
            </div>

            {/* Navigation */}
            <nav className="mt-6 px-4 flex-1 overflow-y-auto">
              <button className="w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-left font-medium bg-[#b28341] text-[#f9f6ed] shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer">
                <FaShoppingBag size={20} />
                <span>Order Details</span>
              </button>
            </nav>

            {/* Go Back Button */}
            <div className="p-4 flex-shrink-0">
              <button
                onClick={goback}
                className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 transform hover:scale-105"
              >
                <FaSignOutAlt size={20} />
                <span>Go Back</span>
              </button>
            </div>
          </div>

          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
              onClick={toggleSidebar}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen">
            <div className="h-full overflow-y-auto">
              <div className="p-4 lg:p-6">
                <h2 className="text-2xl font-bold mb-6 text-[#7a4e2e] dark:text-[#e1d0a7]">
                  My Purchases
                </h2>

                {/* Order Status Tabs */}
                <div className="bg-white dark:bg-[#67412c] rounded-lg shadow-sm border border-[#e1d0a7] dark:border-[#7a4e2e] mb-6">
                  <div className="flex flex-wrap border-b border-[#e1d0a7] dark:border-[#7a4e2e]">
                    {orderTabs.map((tab) => (
                      <button
                        key={tab.name}
                        onClick={() => {
                          setActiveOrderTab(tab.name);
                          // Update URL parameter
                          const tabParam = tab.name
                            .toLowerCase()
                            .replace(" ", "_");
                          if (tabParam === "all") {
                            searchParams.delete("tab");
                          } else {
                            searchParams.set("tab", tabParam);
                          }
                          setSearchParams(searchParams);
                        }}
                        className={`cursor-pointer px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 flex items-center gap-2 ${
                          activeOrderTab === tab.name
                            ? "border-[#b28341] text-[#b28341] bg-[#f9f6ed] dark:bg-[#59382a]"
                            : "border-transparent text-[#996936] dark:text-[#e1d0a7] hover:text-[#7a4e2e] dark:hover:text-[#f9f6ed] hover:bg-[#f9f6ed] dark:hover:bg-[#59382a]"
                        }`}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </div>
                  {/* Orders List (Tab Components) */}
                  <div>
                    {(() => {
                      switch (activeOrderTab) {
                        case "All":
                          return <All />;
                        case "To Pay":
                          return <ToPay />;
                        case "To Receive":
                          return <ToReceive />;
                        case "In Transit":
                          return <InTransit />;
                        case "Completed":
                          return <Completed />;
                        case "Cancelled":
                          return <Cancelled />;
                        default:
                          return null;
                      }
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
