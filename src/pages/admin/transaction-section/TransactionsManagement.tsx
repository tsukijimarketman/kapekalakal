import React, { useState, useEffect, useCallback } from "react";
import {
  FaSearch,
  FaEye,
  FaUser,
  FaSpinner,
  FaTruck,
  FaMapMarkerAlt,
  FaClock,
  FaBox,
  FaTimes,
  FaCheckCircle,
  FaCamera,
} from "react-icons/fa";
import { toast } from "react-toastify";
import TransactionModal from "./TransactionModal";
import DeliveryValidationModal from "./DeliveryValidationModal";
import deliveryApi from "../../../services/deliveryApi";
import type { Transaction } from "../../../../src/types/transaction";

// Status colors mapping with proper typing
const statusColors: StatusColors = {
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

// Define type for validation state
interface ValidationState {
  pickup: boolean;
  delivery: boolean;
}

// Define type for status filter
type StatusFilter =
  | "all"
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "to_receive"
  | "in_transit";

// Define type for validation filter
type ValidationFilter = "all" | "needs_validation" | "validated";

// Define type for status colors
interface StatusColors {
  [key: string]: string;
  pending: string;
  processing: string;
  completed: string;
  cancelled: string;
  to_receive: string;
  in_transit: string;
  default: string;
}

const TransactionsManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [validationFilter, setValidationFilter] =
    useState<ValidationFilter>("all");
  const [isTransactionModalOpen, setIsTransactionModalOpen] =
    useState<boolean>(false);
  const [isValidationModalOpen, setIsValidationModalOpen] =
    useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isValidating, setIsValidating] = useState<ValidationState>({
    pickup: false,
    delivery: false,
  });

  // Format date with error handling
  const formatDate = (dateString: string | Date | undefined | null): string => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date value:", dateString);
        return "Invalid Date";
      }

      return date.toLocaleString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting date:", error, "Input:", dateString);
      return "Invalid Date";
    }
  };

  // Fetch transactions from the API
  const fetchTransactions = useCallback(async (): Promise<void> => {
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
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Handle validation actions with proper type safety and error handling
  const handleValidatePickup = async (transactionId: string) => {
    if (!transactionId) {
      console.error("No transaction ID provided for pickup validation");
      return;
    }

    try {
      setIsValidating((prev) => ({ ...prev, pickup: true }));

      // Call the API to validate pickup
      await deliveryApi.validatePickup(transactionId);

      // Refresh the transactions list to get updated data
      await fetchTransactions();

      toast.success("Pickup validated successfully!");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to validate pickup";
      console.error("Error validating pickup:", error);
      toast.error(errorMessage);
    } finally {
      setIsValidating((prev) => ({ ...prev, pickup: false }));
    }
  };

  const handleValidateDelivery = async (transactionId: string) => {
    if (!transactionId) {
      console.error("No transaction ID provided for delivery validation");
      return;
    }

    try {
      setIsValidating((prev) => ({ ...prev, delivery: true }));

      // Call the API to validate delivery
      await deliveryApi.validateDelivery(transactionId);

      // Refresh the transactions list to get updated data
      await fetchTransactions();

      toast.success("Delivery validated successfully! Transaction completed.");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to validate delivery";
      console.error("Error validating delivery:", error);
      toast.error(errorMessage);
    } finally {
      setIsValidating((prev) => ({ ...prev, delivery: false }));
    }
  };

  // Modal handlers with proper null checks and type safety
  const openTransactionModal = (transaction: Transaction) => {
    if (!transaction) return;

    const { deliveryInfo, statusHistory = [], items = [] } = transaction;

    // Create a properly typed transaction object with safe defaults
    const modalTransaction: Transaction = {
      ...transaction,
      deliveryInfo: {
        ...deliveryInfo,
        estimatedDelivery: deliveryInfo?.estimatedDelivery ?? "",
        pickupPhoto: deliveryInfo?.pickupPhoto ?? "",
        deliveryPhoto: deliveryInfo?.deliveryPhoto ?? "",
        deliveredAt: deliveryInfo?.deliveredAt ?? null,
        adminValidatedDeliveryAt:
          deliveryInfo?.adminValidatedDeliveryAt ?? null,
        adminValidatedPickupAt: deliveryInfo?.adminValidatedPickupAt ?? null,
        pickupCompletedAt: deliveryInfo?.pickupCompletedAt ?? null,
        pickupValidated: deliveryInfo?.pickupValidated ?? false,
        deliveryValidated: deliveryInfo?.deliveryValidated ?? false,
        cancellationDeadline: deliveryInfo?.cancellationDeadline ?? "",
        canCancel: deliveryInfo?.canCancel ?? false,
        assignedDeliveryId: deliveryInfo?.assignedDeliveryId ?? null,
        latitude: deliveryInfo?.latitude,
        longitude: deliveryInfo?.longitude,
      },
      statusHistory: statusHistory ?? [],
      items: items ?? [],
    };

    setSelectedTransaction(modalTransaction);
    setIsTransactionModalOpen(true);
  };

  const openValidationModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsValidationModalOpen(true);
  };

  const closeModals = () => {
    setIsTransactionModalOpen(false);
    setIsValidationModalOpen(false);
    setSelectedTransaction(null);
  };

  // Handle filter changes with proper type safety
  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    // Type assertion with validation
    if (
      [
        "all",
        "pending",
        "processing",
        "completed",
        "cancelled",
        "to_receive",
        "in_transit",
      ].includes(value)
    ) {
      setStatusFilter(value as StatusFilter);
    }
  };

  const handleValidationFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    // Type assertion with validation
    if (["all", "needs_validation", "validated"].includes(value)) {
      setValidationFilter(value as ValidationFilter);
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(
    (transaction: Transaction) => {
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
            ...(transaction.items?.map((item) => item.name) || []),
          ].some(
            (field) =>
              field &&
              field.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;

      // Filter by status
      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;

      // Filter by validation status
      const matchesValidation = (() => {
        if (validationFilter === "all") return true;
        if (validationFilter === "needs_validation") {
          return (
            (transaction.deliveryInfo?.pickupPhoto &&
              !transaction.deliveryInfo?.pickupValidated) ||
            (transaction.deliveryInfo?.deliveryPhoto &&
              !transaction.deliveryInfo?.deliveryValidated)
          );
        }
        if (validationFilter === "validated") {
          return (
            transaction.deliveryInfo?.pickupValidated ||
            transaction.deliveryInfo?.deliveryValidated
          );
        }
        return true;
      })();

      return matchesSearch && matchesStatus && matchesValidation;
    }
  );

  // Get status color with type safety
  const getStatusColor = (status: string | undefined | null): string => {
    if (!status || !(status in statusColors)) return statusColors.default;
    return statusColors[status as keyof StatusColors];
  };

  // Check if transaction has photos to validate
  const hasPhotosToValidate = (transaction: Transaction): boolean => {
    const { deliveryInfo } = transaction;
    return Boolean(
      (deliveryInfo?.pickupPhoto && deliveryInfo.pickupPhoto !== "") ||
        (deliveryInfo?.deliveryPhoto && deliveryInfo.deliveryPhoto !== "")
    );
  };

  // Check if transaction needs validation
  const needsValidation = (transaction: Transaction): boolean => {
    const { deliveryInfo } = transaction;
    if (!deliveryInfo) return false;

    const needsPickupValidation = Boolean(
      deliveryInfo.pickupPhoto &&
        deliveryInfo.pickupPhoto !== "" &&
        deliveryInfo.pickupValidated !== true
    );

    const needsDeliveryValidation = Boolean(
      deliveryInfo.deliveryPhoto &&
        deliveryInfo.deliveryPhoto !== "" &&
        deliveryInfo.deliveryValidated !== true
    );

    return needsPickupValidation || needsDeliveryValidation;
  };

  // Render validation status badge with proper null checks
  const renderValidationBadge = (
    validated: boolean | undefined,
    type: "pickup" | "delivery"
  ) => {
    const isPickup = type === "pickup";

    if (validated) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FaCheckCircle className="mr-1" />
          {isPickup ? "Pickup Validated" : "Delivery Validated"}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <FaClock className="mr-1" />
        {isPickup ? "Needs Pickup Validation" : "Needs Delivery Validation"}
      </span>
    );
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

            {/* Status Filter */}
            <div className="w-full">
              <select
                className="w-full px-3 py-2 rounded-lg border border-[#e1d0a7] dark:border-[#7a4e2e] 
                  bg-[#f9f6ed] dark:bg-[#59382a] text-[#59382a] dark:text-[#f9f6ed]
                  focus:outline-none focus:ring-2 focus:ring-[#b28341]"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="all">All Status</option>
                <option value="to_receive">To Receive</option>
                <option value="in_transit">In Transit</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Validation Filter */}
            <div className="w-full">
              <select
                className="w-full px-3 py-2 rounded-lg border border-[#e1d0a7] dark:border-[#7a4e2e] 
                  bg-[#f9f6ed] dark:bg-[#59382a] text-[#59382a] dark:text-[#f9f6ed]
                  focus:outline-none focus:ring-2 focus:ring-[#b28341]"
                value={validationFilter}
                onChange={handleValidationFilterChange}
              >
                <option value="all">All Validations</option>
                <option value="needs_validation">Needs Validation</option>
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

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => openTransactionModal(transaction)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#b28341] hover:bg-[#996936] 
                             text-white rounded-lg transition-colors duration-200 flex-1"
                  >
                    <FaEye />
                    View Details
                  </button>
                  {hasPhotosToValidate(transaction) && (
                    <button
                      onClick={() => openValidationModal(transaction)}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 flex-1 text-white ${
                        needsValidation(transaction)
                          ? "bg-orange-600 hover:bg-orange-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      <FaCamera />
                      {needsValidation(transaction)
                        ? "Validate Photos"
                        : "View Validation"}
                    </button>
                  )}
                </div>
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

              {/* Validation Status */}
              {hasPhotosToValidate(transaction) && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#e1d0a7] dark:border-[#7a4e2e]">
                  {/* Pickup Status */}
                  {transaction.deliveryInfo?.pickupPhoto && (
                    <div className="flex-1">
                      {renderValidationBadge(
                        transaction.deliveryInfo?.pickupValidated,
                        "pickup"
                      )}
                    </div>
                  )}

                  {/* Delivery Status */}
                  {transaction.deliveryInfo?.deliveryPhoto && (
                    <div className="flex-1">
                      {transaction.deliveryInfo?.deliveryValidated ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-lg">
                          <FaCheckCircle />
                          <span className="text-sm font-medium">
                            Delivery Validated
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 rounded-lg">
                          <FaCamera />
                          <span className="text-sm font-medium">
                            Delivery Pending Validation
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
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
      {selectedTransaction && (
        <TransactionModal
          isOpen={isTransactionModalOpen}
          transaction={selectedTransaction}
          onClose={closeModals}
          onValidatePickup={handleValidatePickup}
          onValidateDelivery={handleValidateDelivery}
          isValidating={isValidating}
        />
      )}

      {/* Delivery Validation Modal */}
      {selectedTransaction?.deliveryInfo && selectedTransaction._id && (
        <DeliveryValidationModal
          isOpen={isValidationModalOpen}
          onClose={closeModals}
          onValidate={async (type: "pickup" | "delivery") => {
            if (!selectedTransaction._id) return;

            if (type === "pickup") {
              await handleValidatePickup(selectedTransaction._id);
            } else {
              await handleValidateDelivery(selectedTransaction._id);
            }
          }}
          pickupPhoto={selectedTransaction.deliveryInfo?.pickupPhoto}
          deliveryPhoto={selectedTransaction.deliveryInfo?.deliveryPhoto}
          isPickupValidated={
            selectedTransaction.deliveryInfo?.pickupValidated ?? false
          }
          isDeliveryValidated={
            selectedTransaction.deliveryInfo?.deliveryValidated ?? false
          }
        />
      )}
    </div>
  );
};

export default TransactionsManagement;
