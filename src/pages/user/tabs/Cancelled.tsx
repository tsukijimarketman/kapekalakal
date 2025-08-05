import React from "react";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  status: "cancelled";
  image: string;
  orderTotal: number;
}

const Cancelled: React.FC = () => {
  // Sample data - only "cancelled" status orders
  const orders: OrderItem[] = [
    {
      id: "1",
      productName: "Premium Arabica Coffee Beans 250g",
      quantity: 3,
      price: 19,
      originalPrice: 20,
      status: "cancelled",
      image: "/api/placeholder/80/80",
      orderTotal: 65,
    },
    {
      id: "4",
      productName: "Organic Fair Trade Coffee 1kg",
      quantity: 2,
      price: 45,
      originalPrice: 50,
      status: "cancelled",
      image: "/api/placeholder/80/80",
      orderTotal: 90,
    },
    {
      id: "7",
      productName: "Coffee Grinder Manual Burr",
      quantity: 1,
      price: 75,
      status: "cancelled",
      image: "/api/placeholder/80/80",
      orderTotal: 75,
    },
  ];

  const getStatusBadge = () => {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
        CANCELLED
      </span>
    );
  };

  if (orders.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-[#996936] dark:text-[#e1d0a7] text-lg">
          No cancelled orders
        </div>
        <div className="text-[#7a4e2e] dark:text-[#d0b274] text-sm mt-2">
          Cancelled orders will appear here
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="You can search by Order ID or Product name"
            className="w-full px-4 py-3 pl-10 rounded-lg border border-[#e1d0a7] dark:border-[#7a4e2e] bg-white dark:bg-[#59382a] text-[#59382a] dark:text-[#f9f6ed] placeholder-[#996936] dark:placeholder-[#d0b274] focus:outline-none focus:ring-2 focus:ring-[#b28341] focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-[#996936] dark:text-[#d0b274]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white dark:bg-[#67412c] rounded-lg border border-[#e1d0a7] dark:border-[#7a4e2e] overflow-hidden"
        >
          {/* Order Header */}
          <div className="px-4 py-3 bg-[#f9f6ed] dark:bg-[#59382a] border-b border-[#e1d0a7] dark:border-[#7a4e2e] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                Order #{order.id}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-[#996936] dark:text-[#d0b274] font-medium">
                This order has been cancelled
              </span>
              {getStatusBadge()}
            </div>
          </div>

          {/* Product Details */}
          <div className="p-4">
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={order.image}
                  alt={order.productName}
                  className="w-20 h-20 object-cover rounded-lg border border-[#e1d0a7] dark:border-[#7a4e2e] opacity-75"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-[#59382a] dark:text-[#f9f6ed] font-medium text-sm mb-2 line-clamp-2">
                  {order.productName}
                </h3>
                <div className="text-[#996936] dark:text-[#d0b274] text-sm mb-2">
                  x{order.quantity}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#b28341] font-semibold">
                    ₱{order.price}
                  </span>
                  {order.originalPrice && order.originalPrice > order.price && (
                    <span className="text-[#996936] dark:text-[#d0b274] text-sm line-through">
                      ₱{order.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Order Total */}
              <div className="text-right flex-shrink-0">
                <div className="text-[#996936] dark:text-[#d0b274] text-sm mb-1">
                  Order Total:
                </div>
                <div className="text-[#b28341] font-bold text-lg">
                  ₱{order.orderTotal}
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className="mt-4 pt-3 border-t border-[#e1d0a7] dark:border-[#7a4e2e]">
              <div className="flex justify-between items-center">
                <p className="text-[#7a4e2e] dark:text-[#d0b274] text-sm">
                  Order was cancelled. Refund processing if applicable
                </p>
                <button className="px-4 py-2 bg-[#b28341] hover:bg-[#996936] text-white text-sm font-medium rounded-lg transition-colors duration-200">
                  View cancellation details
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cancelled;
