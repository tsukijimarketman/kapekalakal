import React, { useState } from "react";
import { FaTimes, FaImage, FaCheckCircle, FaEye } from "react-icons/fa";
import type { Transaction } from "../../../../src/types/transaction";

interface ValidationState {
  pickup: boolean;
  delivery: boolean;
}

interface TransactionModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onValidatePickup: (transactionId: string) => Promise<void>;
  onValidateDelivery: (transactionId: string) => Promise<void>;
  isValidating?: ValidationState;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  transaction,
  onClose,
  onValidatePickup,
  onValidateDelivery,
  isValidating: propValidating = { pickup: false, delivery: false },
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [localValidating, setLocalValidating] = useState({
    pickup: false,
    delivery: false,
  });

  // Combine prop and local validation states
  const isValidating = {
    pickup: propValidating.pickup || localValidating.pickup,
    delivery: propValidating.delivery || localValidating.delivery,
  } as const;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      processing:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      in_transit:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      delivered:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    };
    return (
      statusColors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    );
  };

  const handleValidatePickup = async () => {
    if (!transaction) return;
    try {
      setLocalValidating((prev) => ({ ...prev, pickup: true }));
      await onValidatePickup(transaction._id);
      setImagePreview(null);
    } catch (error) {
      console.error("Error validating pickup:", error);
      setValidationError(
        error instanceof Error ? error.message : "Failed to validate pickup"
      );
    } finally {
      setLocalValidating((prev) => ({ ...prev, pickup: false }));
    }
  };

  const handleValidateDelivery = async () => {
    if (!transaction) return;
    try {
      setLocalValidating((prev) => ({ ...prev, delivery: true }));
      await onValidateDelivery(transaction._id);
      setImagePreview(null);
    } catch (error) {
      console.error("Error validating delivery:", error);
      setValidationError(
        error instanceof Error ? error.message : "Failed to validate delivery"
      );
    } finally {
      setLocalValidating((prev) => ({ ...prev, delivery: false }));
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-[#f9f6ed] dark:bg-[#59382a] rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#e1d0a7] dark:border-[#7a4e2e]">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-[#7a4e2e] dark:text-[#e1d0a7]">
                Transaction Details
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  transaction.status
                )}`}
              >
                {transaction.status.replace("_", " ").toUpperCase()}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#e1d0a7] dark:hover:bg-[#7a4e2e] rounded-lg transition-colors"
            >
              <FaTimes
                className="text-[#7a4e2e] dark:text-[#e1d0a7]"
                size={20}
              />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Transaction Info */}
            <div className="bg-[#efe8d2] dark:bg-[#67412c] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-[#7a4e2e] dark:text-[#e1d0a7] mb-4">
                Transaction Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#996936] dark:text-[#d0b274]">
                    Transaction ID
                  </p>
                  <p className="font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                    {transaction.transactionId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#996936] dark:text-[#d0b274]">
                    Created At
                  </p>
                  <p className="font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#996936] dark:text-[#d0b274]">
                    Customer ID
                  </p>
                  <p className="font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                    {transaction.customerId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#996936] dark:text-[#d0b274]">
                    Payment Method
                  </p>
                  <p className="font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                    {transaction.paymentMethod}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-[#996936] dark:text-[#d0b274]">
                    Shipping Address
                  </p>
                  <p className="font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                    {transaction.shippingAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-[#efe8d2] dark:bg-[#67412c] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-[#7a4e2e] dark:text-[#e1d0a7] mb-4">
                Order Items
              </h3>
              <div className="space-y-3">
                {transaction.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-[#e1d0a7] dark:bg-[#7a4e2e] rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                        {item.name}
                      </h4>
                      <p className="text-sm text-[#996936] dark:text-[#d0b274]">
                        ₱{item.price} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#7a4e2e] dark:text-[#e1d0a7]">
                        ₱{item.subtotal}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[#d0b274] dark:border-[#996936]">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-[#7a4e2e] dark:text-[#e1d0a7]">
                    Total Amount:
                  </span>
                  <span className="text-lg font-bold text-[#b28341]">
                    ₱{transaction.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-[#efe8d2] dark:bg-[#67412c] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-[#7a4e2e] dark:text-[#e1d0a7] mb-4">
                Delivery Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-[#996936] dark:text-[#d0b274]">
                    Delivery Rider ID
                  </p>
                  <p className="font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                    {transaction.deliveryInfo?.assignedDeliveryId ||
                      "Not assigned"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#996936] dark:text-[#d0b274]">
                    Estimated Delivery
                  </p>
                  <p className="font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                    {formatDate(transaction.deliveryInfo.estimatedDelivery)}
                  </p>
                </div>
                {transaction.deliveryInfo.deliveredAt && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-[#996936] dark:text-[#d0b274]">
                      Delivered At
                    </p>
                    <p className="font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                      {formatDate(transaction.deliveryInfo.deliveredAt)}
                    </p>
                  </div>
                )}
              </div>

              {/* Photo Validation Section */}
              <div className="space-y-4">
                {/* Pickup Photo */}
                {transaction.deliveryInfo?.pickupPhoto && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <FaImage className="mr-2" /> Pickup Photo
                      {transaction.deliveryInfo.pickupValidated ? (
                        <span
                          className="ml-2 text-green-500"
                          title="Pickup validated"
                        >
                          <FaCheckCircle className="inline" /> Validated
                        </span>
                      ) : (
                        <button
                          onClick={handleValidatePickup}
                          disabled={isValidating.pickup}
                          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center"
                        >
                          {isValidating.pickup
                            ? "Validating..."
                            : "Validate Pickup"}
                        </button>
                      )}
                    </h3>
                    <div className="relative">
                      <img
                        src={transaction.deliveryInfo.pickupPhoto}
                        alt="Pickup proof"
                        className="w-full h-64 object-cover rounded-lg cursor-pointer"
                        onClick={() =>
                          setImagePreview(
                            transaction.deliveryInfo?.pickupPhoto || null
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          setImagePreview(
                            transaction.deliveryInfo?.pickupPhoto || null
                          )
                        }
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
                        aria-label="View full size"
                      >
                        <FaEye />
                      </button>
                    </div>
                  </div>
                )}

                {/* Delivery Photo */}
                {transaction.deliveryInfo?.deliveryPhoto && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <FaImage className="mr-2" /> Delivery Photo
                      {transaction.deliveryInfo.deliveryValidated ? (
                        <span
                          className="ml-2 text-green-500"
                          title="Delivery validated"
                        >
                          <FaCheckCircle className="inline" /> Validated
                        </span>
                      ) : (
                        <button
                          onClick={handleValidateDelivery}
                          disabled={
                            isValidating.delivery ||
                            !transaction.deliveryInfo.pickupValidated
                          }
                          className={`ml-2 px-3 py-1 text-white rounded text-sm flex items-center ${
                            isValidating.delivery
                              ? "bg-blue-400 cursor-not-allowed"
                              : transaction.deliveryInfo.pickupValidated
                              ? "bg-blue-500 hover:bg-blue-600"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                          title={
                            !transaction.deliveryInfo.pickupValidated
                              ? "Please validate pickup photo first"
                              : "Validate delivery photo"
                          }
                        >
                          {isValidating.delivery
                            ? "Validating..."
                            : "Validate Delivery"}
                        </button>
                      )}
                    </h3>
                    <div className="relative">
                      <img
                        src={transaction.deliveryInfo.deliveryPhoto}
                        alt="Delivery proof"
                        className="w-full h-64 object-cover rounded-lg cursor-pointer"
                        onClick={() =>
                          setImagePreview(
                            transaction.deliveryInfo?.deliveryPhoto || null
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          setImagePreview(
                            transaction.deliveryInfo?.deliveryPhoto || null
                          )
                        }
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
                        aria-label="View full size"
                      >
                        <FaEye />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#e1d0a7] dark:border-[#7a4e2e]">
              {transaction.deliveryInfo.pickupPhoto &&
                !transaction.deliveryInfo.pickupValidated && (
                  <button
                    onClick={handleValidatePickup}
                    disabled={isValidating.pickup}
                    className={`px-4 py-2 rounded-md ${
                      isValidating.pickup
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isValidating.pickup ? "Validating..." : "Validate Pickup"}
                  </button>
                )}

              {transaction.deliveryInfo.deliveryPhoto &&
                !transaction.deliveryInfo.deliveryValidated && (
                  <button
                    onClick={handleValidateDelivery}
                    disabled={isValidating.delivery}
                    className={`px-4 py-2 rounded-md ${
                      isValidating.delivery
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {isValidating.delivery ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Validating Delivery...
                      </div>
                    ) : (
                      <span>Validate Delivery</span>
                    )}
                  </button>
                )}

              <button
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 
                         bg-[#996936] hover:bg-[#7a4e2e] text-white rounded-lg 
                         font-medium transition-colors duration-200"
              >
                <FaTimes />
                Close
              </button>
            </div>
          </div>
        </div>
        {validationError && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4"
            role="alert"
          >
            <p className="font-bold">Validation Error</p>
            <p>{validationError}</p>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {imagePreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setImagePreview(null)}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full 
                       hover:bg-opacity-70 transition-all z-10"
            >
              <FaTimes size={20} />
            </button>
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionModal;
