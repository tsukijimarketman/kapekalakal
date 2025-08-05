import React from "react";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  status: "to_receive" | "completed" | "cancelled" | "to_pay" | "in_transit";
  image: string;
  orderTotal: number;
}

const All: React.FC = () => {
  // Sample data - replace with your actual data later
  const orders: OrderItem[] = [
    {
      id: "1",
      productName: "Premium Arabica Coffee Beans 250g",
      quantity: 3,
      price: 19,
      originalPrice: 20,
      status: "to_receive",
      image: "/api/placeholder/80/80",
      orderTotal: 65,
    },
    {
      id: "2",
      productName: "Espresso Blend Coffee Beans 500g",
      quantity: 1,
      price: 180,
      originalPrice: 460,
      status: "completed",
      image: "/api/placeholder/80/80",
      orderTotal: 180,
    },
    {
      id: "3",
      productName: "French Press Coffee Maker",
      quantity: 1,
      price: 35,
      status: "cancelled",
      image: "/api/placeholder/80/80",
      orderTotal: 35,
    },
  ];

  const getStatusBadge = (status: OrderItem["status"]) => {
    const statusConfig = {
      to_receive: {
        text: "TO RECEIVE",
        bgColor: "bg-teal-100 dark:bg-teal-900/30",
        textColor: "text-teal-700 dark:text-teal-300",
      },
      completed: {
        text: "COMPLETED",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        textColor: "text-green-700 dark:text-green-300",
      },
      cancelled: {
        text: "CANCELLED",
        bgColor: "bg-red-100 dark:bg-red-900/30",
        textColor: "text-red-700 dark:text-red-300",
      },
      to_pay: {
        text: "TO PAY",
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
        textColor: "text-orange-700 dark:text-orange-300",
      },
      in_transit: {
        text: "IN TRANSIT",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        textColor: "text-blue-700 dark:text-blue-300",
      },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
      >
        {config.text}
      </span>
    );
  };

  const getStatusMessage = (status: OrderItem["status"]) => {
    const messages = {
      to_receive: "Confirm receipt after you've checked the received items",
      completed: "Order has been completed successfully",
      cancelled: "This order has been cancelled",
      to_pay: "Please complete your payment",
      in_transit: "Your order is on the way",
    };
    return messages[status];
  };

  if (orders.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-[#996936] dark:text-[#e1d0a7] text-lg">
          No orders found
        </div>
        <div className="text-[#7a4e2e] dark:text-[#d0b274] text-sm mt-2">
          Your order history will appear here
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
            {getStatusBadge(order.status)}
          </div>

          {/* Product Details */}
          <div className="p-4">
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={order.image}
                  alt={order.productName}
                  className="w-20 h-20 object-cover rounded-lg border border-[#e1d0a7] dark:border-[#7a4e2e]"
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
                  {getStatusMessage(order.status)}
                </p>
                {order.status === "to_receive" && (
                  <button className="px-4 py-2 bg-[#b28341] hover:bg-[#996936] text-white text-sm font-medium rounded-lg transition-colors duration-200">
                    Confirm Receipt
                  </button>
                )}
                {order.status === "completed" && (
                  <button className="px-4 py-2 border border-[#b28341] text-[#b28341] hover:bg-[#b28341] hover:text-white text-sm font-medium rounded-lg transition-colors duration-200">
                    Rate Product
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default All;
