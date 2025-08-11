import React, { useEffect, useState } from "react";
import axios from "axios";

type TxStatus =
  | "to_receive"
  | "completed"
  | "cancelled"
  | "to_pay"
  | "in_transit";

interface TransactionItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal?: number;
}

interface TransactionDTO {
  _id: string;
  items: TransactionItem[];
  totalAmount: number;
  status: TxStatus;
  createdAt: string;
}

const All: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;
    const fetchTx = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get<
          { success?: boolean; data?: any } | TransactionDTO[]
        >(`${import.meta.env.VITE_API_URL}/transactions/user`, {
          withCredentials: true,
        });

        // Normalize API response:
        // - Option A: raw array
        // - Option B: { success, data: TransactionDTO[] }
        // - Option C: { success, data: { transactions: TransactionDTO[], pagination: {...} } }
        const list: TransactionDTO[] = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.data)
          ? (data as any).data
          : Array.isArray((data as any)?.data?.transactions)
          ? (data as any).data.transactions
          : [];

        if (!mounted) return;
        const sorted = [...list].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTransactions(sorted);
      } catch (err: any) {
        if (!mounted) return;
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load orders"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchTx();
    return () => {
      mounted = false;
    };
  }, []);

  const formatCurrency = (n: number) =>
    `₱${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getStatusBadge = (status: TxStatus) => {
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

  const getStatusMessage = (status: TxStatus) => {
    const messages = {
      to_receive: "Confirm receipt after you've checked the received items",
      completed: "Order has been completed successfully",
      cancelled: "This order has been cancelled",
      to_pay: "Please complete your payment",
      in_transit: "Your order is on the way",
    };
    return messages[status];
  };

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter((tx) => {
    const searchLower = searchTerm.toLowerCase();
    const orderIdMatch = tx._id.toLowerCase().includes(searchLower);
    const productNameMatch = tx.items?.some((item) =>
      item.name.toLowerCase().includes(searchLower)
    );
    return orderIdMatch || productNameMatch;
  });

  if (loading) {
    return (
      <div className="p-8 text-center text-[#996936] dark:text-[#e1d0a7]">
        Loading orders…
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (transactions.length === 0) {
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
      {filteredTransactions.length === 0 && searchTerm ? (
        <div className="p-8 text-center">
          <div className="text-[#996936] dark:text-[#e1d0a7] text-lg">
            No orders found
          </div>
          <div className="text-[#7a4e2e] dark:text-[#d0b274] text-sm mt-2">
            Try adjusting your search terms
          </div>
        </div>
      ) : (
        filteredTransactions.map((tx) => {
          const first = tx.items?.[0];
          const restCount = Math.max(0, (tx.items?.length || 0) - 1);
          const qty = tx.items?.reduce((a, b) => a + (b.quantity || 0), 0) || 0;
          const hasMultipleItems = (tx.items?.length || 0) > 1;
          const isExpanded = expandedOrders.has(tx._id);

          return (
            <div
              key={tx._id}
              className="bg-white dark:bg-[#67412c] rounded-lg border border-[#e1d0a7] dark:border-[#7a4e2e] overflow-hidden"
            >
              {/* Order Header */}
              <div className="px-4 py-3 bg-[#f9f6ed] dark:bg-[#59382a] border-b border-[#e1d0a7] dark:border-[#7a4e2e] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                    Order #{tx._id}
                  </span>
                </div>
                {getStatusBadge(tx.status)}
              </div>

              {/* Product Details */}
              <div className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={first?.image || "/api/placeholder/80/80"}
                      alt={first?.name || "Order"}
                      className={`w-20 h-20 object-cover rounded-lg border border-[#e1d0a7] dark:border-[#7a4e2e] ${
                        tx.status === "cancelled" ? "opacity-75" : ""
                      }`}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#59382a] dark:text-[#f9f6ed] font-medium text-sm mb-2 line-clamp-2">
                      {first?.name || "Order"}
                      {hasMultipleItems && !isExpanded && (
                        <span className="text-[#996936] dark:text-[#d0b274] ml-1">
                          +{restCount} more
                        </span>
                      )}
                    </h3>
                    <div className="text-[#996936] dark:text-[#d0b274] text-sm mb-2">
                      x{first?.quantity || 0}
                      {hasMultipleItems && !isExpanded && (
                        <span className="ml-1">(Total: {qty} items)</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#b28341] font-semibold">
                        {first ? formatCurrency(first.price) : ""}
                      </span>
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-[#996936] dark:text-[#d0b274] text-sm mb-1">
                      Order Total:
                    </div>
                    <div className="text-[#b28341] font-bold text-lg">
                      {formatCurrency(tx.totalAmount)}
                    </div>
                  </div>
                </div>

                {/* Dropdown Toggle Button */}
                {hasMultipleItems && (
                  <div className="mt-3">
                    <button
                      onClick={() => toggleOrderExpansion(tx._id)}
                      className="flex items-center gap-2 text-[#b28341] hover:text-[#996936] text-sm font-medium transition-colors duration-200"
                    >
                      <span>
                        {isExpanded ? "Hide" : "Show"} all items (
                        {tx.items?.length || 0})
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Expanded Items */}
                {hasMultipleItems && isExpanded && (
                  <div className="mt-4 space-y-3 border-t border-[#e1d0a7] dark:border-[#7a4e2e] pt-4">
                    {tx.items?.slice(1).map((item, index) => (
                      <div key={`${tx._id}-${index}`} className="flex gap-4">
                        {/* Additional Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.image || "/api/placeholder/80/80"}
                            alt={item.name}
                            className={`w-16 h-16 object-cover rounded-lg border border-[#e1d0a7] dark:border-[#7a4e2e] ${
                              tx.status === "cancelled" ? "opacity-75" : ""
                            }`}
                          />
                        </div>

                        {/* Additional Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[#59382a] dark:text-[#f9f6ed] font-medium text-sm mb-1 line-clamp-2">
                            {item.name}
                          </h4>
                          <div className="text-[#996936] dark:text-[#d0b274] text-sm mb-1">
                            x{item.quantity}
                          </div>
                          <div className="text-[#b28341] font-semibold text-sm">
                            {formatCurrency(item.price)}
                          </div>
                        </div>

                        {/* Additional Product Subtotal */}
                        <div className="text-right flex-shrink-0">
                          <div className="text-[#996936] dark:text-[#d0b274] text-xs mb-1">
                            Subtotal:
                          </div>
                          <div className="text-[#b28341] font-semibold text-sm">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Status Message */}
                <div className="mt-4 pt-3 border-t border-[#e1d0a7] dark:border-[#7a4e2e]">
                  <div className="flex justify-between items-center">
                    <p className="text-[#7a4e2e] dark:text-[#d0b274] text-sm">
                      {getStatusMessage(tx.status)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default All;
