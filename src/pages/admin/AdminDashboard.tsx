import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import ProductsManagement from "../admin/product-section/ProductsManagement";
import UsersManagement from "../admin/user-section/UsersManagement";
import TransactionsManagement from "./transaction-section/TransactionsManagement";

const AdminDashboard = () => {
  const { signout } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    // Using in-memory storage instead of localStorage
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
  const [activeItem, setActiveItem] = useState("Users");

  const menuItems = [
    { name: "Users", icon: FaUsers },
    { name: "Products", icon: FaBoxOpen },
    { name: "Transactions", icon: FaShoppingCart },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = (itemName: string) => {
    setActiveItem(itemName);
    setIsSidebarOpen(false);
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
            KapeKalakal Admin
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
                KapeKalakal Admin
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
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => handleMenuClick(item.name)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-left font-medium
                      transition-all duration-200 transform hover:scale-105 cursor-pointer
                      ${
                        isActive
                          ? "bg-[#b28341] text-[#f9f6ed] shadow-lg"
                          : "text-[#7a4e2e] dark:text-[#e1d0a7] hover:bg-[#e1d0a7] dark:hover:bg-[#7a4e2e] hover:text-[#996936] dark:hover:text-[#efe8d2]"
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Sign Out Button */}
            <div className="p-4 flex-shrink-0">
              <button
                onClick={signout}
                className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 transform hover:scale-105"
              >
                <FaSignOutAlt size={20} />
                <span>Sign Out</span>
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
              {activeItem === "Users" && <UsersManagement />}

              {activeItem === "Products" && <ProductsManagement />}

              {activeItem === "Transactions" && <TransactionsManagement />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
