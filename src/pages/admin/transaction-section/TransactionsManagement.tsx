import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEye,
  FaUser,
  FaSpinner,
  FaTruck,
  FaMapMarkerAlt,
  FaBox,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import TransactionModal from "./TransactionModal";
// Use relative imports to avoid path resolution issues
import deliveryApi from "../../../services/deliveryApi";
import type { Transaction } from "../../../../src/types/transaction";

// Status colors mapping
const statusColors = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  processing:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  to_receive:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  in_transit:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

const TransactionsManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [validationFilter, setValidationFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Format date with error handling
  const formatDate = (dateString: string | Date | undefined | null): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error, "Input:", dateString);
      return "Invalid Date";
    }
  };

  // Fetch transactions from the backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await deliveryApi.listAllTasks();

        if (response && response.data) {
          // The API returns { ok: true, data: [...] }
          const responseData = response.data;
          // Handle both array and single object responses
          const transactionsData = Array.isArray(responseData)
            ? responseData
            : responseData.data && Array.isArray(responseData.data)
            ? responseData.data
            : [responseData];

          console.log("Fetched transactions:", transactionsData);
          setTransactions(transactionsData);
        } else {
          console.log("No data in response:", response);
          setTransactions([]);
        }
      } catch (err) {
        const error = err as Error;
        const errorMessage = error.message || "Failed to load transactions";
        setError(errorMessage);
        console.error("Error fetching transactions:", error);
        toast.error(errorMessage);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Handle validation
  const handleValidatePickup = async (transactionId: string) => {
    try {
      setIsValidating(true);
      await deliveryApi.validatePickup(transactionId);

      // Update local state
      setTransactions((prev) =>
        prev.map((tx) =>
          tx._id === transactionId
            ? {
                ...tx,
                deliveryInfo: {
                  ...tx.deliveryInfo,
                  pickupValidated: true,
                  adminValidatedPickupAt: new Date().toISOString(),
                },
              }
            : tx
        )
      );

      toast.success("Pickup validated successfully");
    } catch (err) {
      const error = err as Error;
      console.error("Failed to validate pickup:", error);
      toast.error(error.message || "Failed to validate pickup");
    } finally {
      setIsValidating(false);
    }
  };

  const handleValidateDelivery = async (transactionId: string) => {
    try {
      setIsValidating(true);
      await deliveryApi.validateDelivery(transactionId);

      // Update local state
      setTransactions((prev) =>
        prev.map((tx) =>
          tx._id === transactionId
            ? {
                ...tx,
                status: "completed",
                deliveryInfo: {
                  ...tx.deliveryInfo,
                  deliveryValidated: true,
                  adminValidatedDeliveryAt: new Date().toISOString(),
                  deliveredAt: new Date().toISOString(),
                },
              }
            : tx
        )
      );

      toast.success("Delivery validated successfully");
    } catch (err) {
      const error = err as Error;
      console.error("Failed to validate delivery:", error);
      toast.error(error.message || "Failed to validate delivery");
    } finally {
      setIsValidating(false);
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    // Skip if transaction is null/undefined
    if (!transaction) return false;

    // Search by transaction ID, customer ID, shipping address, or product names
    const matchesSearch = searchTerm
      ? [
          transaction.transactionId,
          transaction.customerId,
          transaction.shippingAddress,
          transaction.paymentMethod,
          transaction.status,
        ].some(
          (value) =>
            value &&
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true;

    // Status filter
    const matchesStatus = (() => {
      if (statusFilter === "all") return true;
      if (statusFilter === "in_transit")
        return transaction.status === "in_transit";
      if (statusFilter === "to_receive")
        return transaction.status === "to_receive";
      if (statusFilter === "cancelled")
        return transaction.status === "cancelled";
      if (statusFilter === "completed")
        return transaction.status === "completed";
      return true;
    })();

    // Validation filter
    const matchesValidation = (() => {
      if (validationFilter === "all") return true;
      if (validationFilter === "pending") {
        return (
          !transaction.deliveryInfo?.pickupValidated ||
          !transaction.deliveryInfo?.deliveryValidated
        );
      }
      if (validationFilter === "validated") {
        return (
          transaction.deliveryInfo?.pickupValidated &&
          transaction.deliveryInfo?.deliveryValidated
        );
      }
      return true;
    })();

    return matchesSearch && matchesStatus && matchesValidation;
  });

  // Get status color with type safety
  const getStatusColor = (status: string | undefined | null): string => {
    if (!status) return statusColors.default;

    const normalizedStatus = status.toLowerCase();
    return (
      statusColors[normalizedStatus as keyof typeof statusColors] ||
      statusColors.default
    );
  };

  // Transaction modal handler with proper type safety
  const handleOpenModal = (transaction: Transaction) => {
    const { deliveryInfo, statusHistory = [], items = [] } = transaction;

    // Create a properly typed transaction object
    const modalTransaction: Transaction = {
      ...transaction,
      deliveryInfo: {
        estimatedDelivery: deliveryInfo?.estimatedDelivery || "",
        pickupPhoto: deliveryInfo?.pickupPhoto || "",
        deliveryPhoto: deliveryInfo?.deliveryPhoto || "",
        deliveredAt: deliveryInfo?.deliveredAt || null,
        adminValidatedDeliveryAt:
          deliveryInfo?.adminValidatedDeliveryAt || null,
        adminValidatedPickupAt: deliveryInfo?.adminValidatedPickupAt || null,
        pickupCompletedAt: deliveryInfo?.pickupCompletedAt || null,
        pickupValidated: deliveryInfo?.pickupValidated || false,
        deliveryValidated: deliveryInfo?.deliveryValidated || false,
        cancellationDeadline: deliveryInfo?.cancellationDeadline || "",
        canCancel: deliveryInfo?.canCancel || false,
        assignedDeliveryId: deliveryInfo?.assignedDeliveryId || null,
        // Optional fields with null checks
        latitude: deliveryInfo?.latitude,
        longitude: deliveryInfo?.longitude,
      },
      statusHistory,
      items,
    };

    setSelectedTransaction(modalTransaction);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-2xl text-orange-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        <p className="font-medium">Error loading transactions</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f9f6ed] dark:bg-[#59382a] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
            Transactions Management
          </h1>
          <p className="text-[#996936] dark:text-[#d0b274]">
            Manage and validate delivery transactions
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#efe8d2] dark:bg-[#67412c] rounded-lg p-4 sm:p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Search - Full width on mobile, 2 columns on sm, 1 column on lg */}
            <div className="relative lg:col-span-2">
              <input
                type="text"
                placeholder="Search by ID, customer, or address..."
                className="pl-10 pr-4 py-2 rounded-lg w-full
                  bg-[#f9f6ed] dark:bg-[#59382a] 
                  border border-[#e1d0a7] dark:border-[#7a4e2e]
                  text-[#59382a] dark:text-[#f9f6ed] placeholder-[#b28341]/70 dark:placeholder-[#d0b274]/70
                  focus:outline-none focus:ring-2 focus:ring-[#b28341]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-[#b28341] dark:text-[#d0b274]" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3 text-[#b28341] hover:text-[#7a4e2e] dark:text-[#d0b274] dark:hover:text-[#f9f6ed]"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Status Filter - Full width on mobile, 1 column on sm */}
            <div className="w-full">
              <select
                className="w-full px-3 py-2 rounded-lg border border-[#e1d0a7] dark:border-[#7a4e2e] 
                  bg-[#f9f6ed] dark:bg-[#59382a] text-[#59382a] dark:text-[#f9f6ed]
                  focus:outline-none focus:ring-2 focus:ring-[#b28341]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="to_receive">To Receive</option>
                <option value="in_transit">In Transit</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Validation Filter - Full width on mobile, 1 column on sm */}
            <div className="w-full">
              <select
                className="w-full px-3 py-2 rounded-lg border border-[#e1d0a7] dark:border-[#7a4e2e] 
                  bg-[#f9f6ed] dark:bg-[#59382a] text-[#59382a] dark:text-[#f9f6ed]
                  focus:outline-none focus:ring-2 focus:ring-[#b28341]"
                value={validationFilter}
                onChange={(e) => setValidationFilter(e.target.value)}
              >
                <option value="all">All Validations</option>
                <option value="pending">Pending</option>
                <option value="validated">Validated</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-center bg-[#e1d0a7] dark:bg-[#7a4e2e] rounded-lg px-4 py-2">
              <span className="text-[#7a4e2e] dark:text-[#e1d0a7] font-medium">
                {filteredTransactions.length} transactions
              </span>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div
              key={`${transaction._id}-${transaction.updatedAt || ""}`}
              className="bg-[#efe8d2] dark:bg-[#67412c] rounded-lg p-6 shadow-sm border border-[#e1d0a7] dark:border-[#7a4e2e]"
            >
              {/* Transaction Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                <div className="flex items-center gap-4 mb-2 lg:mb-0">
                  <div>
                    <h3 className="text-lg font-bold text-[#7a4e2e] dark:text-[#e1d0a7]">
                      {transaction.transactionId}
                    </h3>
                    <p className="text-sm text-[#996936] dark:text-[#d0b274]">
                      Created: {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      transaction?.status
                    )}`}
                  >
                    {transaction?.status
                      ? transaction.status.replace(/_/g, " ").toUpperCase()
                      : "PENDING"}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenModal(transaction)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#b28341] hover:bg-[#996936] 
                           text-white rounded-lg transition-colors duration-200"
                >
                  <FaEye />
                  View Details
                </button>
              </div>

              {/* Transaction Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <FaUser className="text-[#996936] dark:text-[#d0b274]" />
                  <div>
                    <p className="text-xs text-[#996936] dark:text-[#d0b274]">
                      Customer ID
                    </p>
                    <p className="text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                      {transaction.customerId
                        ? `#${transaction.customerId.slice(-8)}`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {transaction.deliveryInfo?.assignedDeliveryId && (
                  <div className="flex items-center gap-2">
                    <FaTruck className="text-[#996936] dark:text-[#d0b274]" />
                    <div>
                      <p className="text-xs text-[#996936] dark:text-[#d0b274]">
                        Delivery Rider
                      </p>
                      <p className="text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                        {transaction.deliveryInfo.assignedDeliveryId.slice(-8)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#996936] dark:text-[#d0b274]" />
                  <div>
                    <p className="text-xs text-[#996936] dark:text-[#d0b274]">
                      Address
                    </p>
                    <p
                      className="text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] truncate"
                      title={
                        transaction.shippingAddress || "No address provided"
                      }
                    >
                      {transaction.shippingAddress || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FaBox className="text-[#996936] dark:text-[#d0b274]" />
                  <div>
                    <p className="text-xs text-[#996936] dark:text-[#d0b274]">
                      Total Amount
                    </p>
                    <p className="text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                      ₱
                      {transaction.totalAmount
                        ? transaction.totalAmount.toFixed(2)
                        : "0.00"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Validation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Pickup Validation */}
                {transaction.deliveryInfo?.pickupPhoto && (
                  <div className="flex-1">
                    {transaction.deliveryInfo.pickupValidated ? (
                      <div
                        className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 
                                    text-green-800 dark:text-green-400 rounded-lg"
                      >
                        <FaCheck />
                        <span className="text-sm font-medium">
                          Pickup Validated
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleValidatePickup(transaction._id)}
                        disabled={isValidating}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 
                                 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg 
                                 transition-colors duration-200 font-medium disabled:opacity-50"
                      >
                        <FaCheck />
                        Validate Pickup
                      </button>
                    )}
                  </div>
                )}

                {/* Delivery Validation */}
                {transaction.deliveryInfo?.deliveryPhoto && (
                  <div className="flex-1">
                    {transaction.deliveryInfo.deliveryValidated ? (
                      <div
                        className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 
                                    text-green-800 dark:text-green-400 rounded-lg"
                      >
                        <FaCheck />
                        <span className="text-sm font-medium">
                          Delivery Validated
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleValidateDelivery(transaction._id)}
                        disabled={isValidating}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 
                                 bg-green-500 hover:bg-green-600 text-white rounded-lg 
                                 transition-colors duration-200 font-medium disabled:opacity-50"
                      >
                        <FaCheck />
                        Validate Delivery
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No transactions found */}
        {filteredTransactions.length === 0 && (
          <div className="bg-[#efe8d2] dark:bg-[#67412c] rounded-lg p-12 text-center">
            <FaBox
              size={48}
              className="mx-auto text-[#996936] dark:text-[#d0b274] mb-4"
            />
            <h3 className="text-lg font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
              No transactions found
            </h3>
            <p className="text-[#996936] dark:text-[#d0b274]">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
        onValidatePickup={handleValidatePickup}
        onValidateDelivery={handleValidateDelivery}
        isValidating={isValidating}
      />
    </div>
  );
};

export default TransactionsManagement;
