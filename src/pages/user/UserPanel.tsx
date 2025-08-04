import React, { useEffect, useState } from "react";
import {
  FaShoppingBag,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserPanel = () => {
  const navigate = useNavigate();
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
    { name: "All", count: null },
    { name: "To Pay", count: null },
    { name: "To Receive", count: 3 },
    { name: "In Transit", count: null },
    { name: "Completed", count: null },
    { name: "Cancelled", count: null },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Mock order data
  const mockOrders = [
    {
      id: 1,
      items: [
        {
          name: "12/ 6 Pcs Cotton Boxer, Murang Boxer Brief,Men's Underwear,Random Color Boxer, Random Boxer for Men",
          variation: "6 PCS,XL",
          quantity: 1,
          price: 188,
          originalPrice: 220,
          image: "/api/placeholder/80/80",
        },
      ],
      total: 169,
      status: "To Receive",
    },
    {
      id: 2,
      items: [
        {
          name: "Shuzili Waterproof long-Lasting Matte Lipstick",
          variation: "Hermosa Pink",
          quantity: 1,
          price: 56,
          originalPrice: 118,
          image: "/api/placeholder/80/80",
        },
      ],
      total: 56,
      status: "To Receive",
    },
  ];

  const filteredOrders =
    activeOrderTab === "All"
      ? mockOrders
      : mockOrders.filter((order) => order.status === activeOrderTab);

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
                <span>My Purchases</span>
              </button>
            </nav>

            {/* Sign Out Button */}
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
                        onClick={() => setActiveOrderTab(tab.name)}
                        className={`cursor-pointer px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 flex items-center gap-2 ${
                          activeOrderTab === tab.name
                            ? "border-[#b28341] text-[#b28341] bg-[#f9f6ed] dark:bg-[#59382a]"
                            : "border-transparent text-[#996936] dark:text-[#e1d0a7] hover:text-[#7a4e2e] dark:hover:text-[#f9f6ed] hover:bg-[#f9f6ed] dark:hover:bg-[#59382a]"
                        }`}
                      >
                        {tab.name}
                        {tab.count && (
                          <span className="bg-[#b28341] text-white text-xs px-2 py-1 rounded-full">
                            {tab.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white dark:bg-[#67412c] rounded-lg shadow-sm border border-[#e1d0a7] dark:border-[#7a4e2e] p-4 lg:p-6"
                      >
                        {/* Order Status */}
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[#996936] dark:text-[#e1d0a7]">
                              Order Status:
                            </span>
                            <span className="text-sm font-medium text-[#b28341] px-2 py-1 bg-[#f9f6ed] dark:bg-[#59382a] rounded">
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        {order.items.map((item, index) => (
                          <div key={index} className="flex gap-4 mb-4">
                            <div className="w-20 h-20 bg-[#e1d0a7] dark:bg-[#7a4e2e] rounded-lg flex items-center justify-center">
                              <FaShoppingBag
                                className="text-[#996936] dark:text-[#e1d0a7]"
                                size={24}
                              />
                            </div>

                            <div className="flex-1">
                              <h3 className="text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2 line-clamp-2">
                                {item.name}
                              </h3>
                              <p className="text-xs text-[#996936] dark:text-[#d0b274] mb-2">
                                Variation: {item.variation}
                              </p>
                              <p className="text-xs text-[#996936] dark:text-[#d0b274] mb-2">
                                x{item.quantity}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-[#b28341]">
                                  ₱{item.price}
                                </span>
                                {item.originalPrice && (
                                  <span className="text-xs text-[#996936] dark:text-[#d0b274] line-through">
                                    ₱{item.originalPrice}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Order Total */}
                        <div className="border-t border-[#e1d0a7] dark:border-[#7a4e2e] pt-4 flex justify-between items-center">
                          <span className="text-sm text-[#996936] dark:text-[#e1d0a7]">
                            Order Total:
                          </span>
                          <span className="text-lg font-bold text-[#b28341]">
                            ₱{order.total}
                          </span>
                        </div>

                        {/* Action Button */}
                        {order.status === "To Receive" && (
                          <div className="mt-4 flex justify-end">
                            <button className="cursor-pointer px-4 py-2 bg-[#e1d0a7] dark:bg-[#7a4e2e] text-[#7a4e2e] dark:text-[#e1d0a7] rounded-lg hover:bg-[#d0b274] dark:hover:bg-[#996936] transition-colors duration-200 text-sm font-medium">
                              Order Received
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <FaShoppingBag className="mx-auto text-6xl text-[#e1d0a7] dark:text-[#7a4e2e] mb-4" />
                      <h3 className="text-lg font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
                        No orders found
                      </h3>
                      <p className="text-[#996936] dark:text-[#d0b274]">
                        You don't have any orders in this category yet.
                      </p>
                    </div>
                  )}
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
