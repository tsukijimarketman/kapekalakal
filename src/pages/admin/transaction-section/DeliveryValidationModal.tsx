import React, { useState } from "react";
import {
  FaTimes,
  FaCheck,
  FaImage,
  FaEye,
  FaCheckCircle,
  FaCamera,
  FaExclamationTriangle,
} from "react-icons/fa";

interface DeliveryValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate: (type: "pickup" | "delivery") => void;
  pickupPhoto?: string;
  deliveryPhoto?: string;
  isPickupValidated: boolean;
  isDeliveryValidated: boolean;
}

const DeliveryValidationModal: React.FC<DeliveryValidationModalProps> = ({
  isOpen,
  onClose,
  onValidate,
  pickupPhoto,
  deliveryPhoto,
  isPickupValidated,
  isDeliveryValidated,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  if (!isOpen) return null;

  const handleValidate = async (type: "pickup" | "delivery") => {
    setIsValidating(true);
    try {
      await onValidate(type);
    } finally {
      setIsValidating(false);
    }
  };

  const canValidateDelivery = isPickupValidated || !pickupPhoto;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-[#f9f6ed] dark:bg-[#59382a] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#e1d0a7] dark:border-[#7a4e2e]">
            <div className="flex items-center gap-3">
              <FaCamera className="text-[#b28341] text-2xl" />
              <h2 className="text-2xl font-bold text-[#7a4e2e] dark:text-[#e1d0a7]">
                Delivery Photo Validation
              </h2>
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
            {/* Instructions */}
            <div className="bg-[#e1d0a7] dark:bg-[#7a4e2e] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-[#7a4e2e] dark:text-[#e1d0a7] mb-2 flex items-center gap-2">
                <FaExclamationTriangle className="text-orange-500" />
                Validation Process
              </h3>
              <div className="text-sm text-[#996936] dark:text-[#d0b274] space-y-2">
                <p>
                  <strong>Step 1:</strong> Delivery rider uploads pickup photo →
                  Admin validates pickup
                </p>
                <p>
                  <strong>Step 2:</strong> After pickup validation, rider
                  delivers to customer and uploads delivery photo
                </p>
                <p>
                  <strong>Step 3:</strong> Admin validates delivery photo →
                  Transaction marked as completed
                </p>
              </div>
            </div>

            {/* Pickup Validation Section */}
            {pickupPhoto && (
              <div className="bg-[#efe8d2] dark:bg-[#67412c] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-[#7a4e2e] dark:text-[#e1d0a7] flex items-center gap-2">
                    <FaImage className="text-[#996936] dark:text-[#d0b274]" />
                    Step 1: Pickup Proof Validation
                  </h3>
                  {!isPickupValidated ? (
                    <button
                      onClick={() => handleValidate("pickup")}
                      disabled={isValidating}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium ${
                        isValidating
                          ? "bg-yellow-400 cursor-not-allowed text-white"
                          : "bg-yellow-500 hover:bg-yellow-600 text-white"
                      }`}
                    >
                      <FaCheck />
                      {isValidating ? "Validating..." : "Validate Pickup"}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-lg">
                      <FaCheckCircle />
                      <span className="font-medium">Pickup Validated ✓</span>
                    </div>
                  )}
                </div>

                {/* Pickup Photo Display */}
                <div className="relative w-full h-80 bg-black rounded-lg overflow-hidden mb-4">
                  <img
                    src={pickupPhoto}
                    alt="Pickup proof from delivery rider"
                    className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setImagePreview(pickupPhoto)}
                  />
                  <button
                    onClick={() => setImagePreview(pickupPhoto)}
                    className="absolute bottom-2 right-2 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-colors"
                    title="View full size"
                  >
                    <FaEye size={18} />
                  </button>
                </div>

                {/* Pickup Status */}
                <div
                  className={`p-4 rounded-lg border-2 ${
                    isPickupValidated
                      ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-700"
                      : "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isPickupValidated ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaCamera className="text-yellow-600" />
                    )}
                    <span
                      className={`font-medium ${
                        isPickupValidated
                          ? "text-green-800 dark:text-green-400"
                          : "text-yellow-800 dark:text-yellow-400"
                      }`}
                    >
                      {isPickupValidated
                        ? "Pickup has been validated by admin"
                        : "Waiting for admin validation"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Validation Section */}
            {deliveryPhoto && (
              <div className="bg-[#efe8d2] dark:bg-[#67412c] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-[#7a4e2e] dark:text-[#e1d0a7] flex items-center gap-2">
                    <FaImage className="text-[#996936] dark:text-[#d0b274]" />
                    Step 2: Delivery Proof Validation
                  </h3>
                  {!isDeliveryValidated ? (
                    <button
                      onClick={() => handleValidate("delivery")}
                      disabled={isValidating || !canValidateDelivery}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium ${
                        isValidating || !canValidateDelivery
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                      title={
                        !canValidateDelivery
                          ? "Please validate pickup first"
                          : "Validate delivery"
                      }
                    >
                      <FaCheck />
                      {isValidating ? "Validating..." : "Validate Delivery"}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-lg">
                      <FaCheckCircle />
                      <span className="font-medium">Delivery Validated </span>
                    </div>
                  )}
                </div>

                {/* Delivery Photo Display */}
                <div className="relative w-full h-80 bg-black rounded-lg overflow-hidden mb-4">
                  <img
                    src={deliveryPhoto}
                    alt="Delivery proof from delivery rider"
                    className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setImagePreview(deliveryPhoto)}
                  />
                  <button
                    onClick={() => setImagePreview(deliveryPhoto)}
                    className="absolute bottom-2 right-2 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-colors"
                    title="View full size"
                  >
                    <FaEye size={18} />
                  </button>
                </div>

                {/* Delivery Status */}
                <div
                  className={`p-4 rounded-lg border-2 ${
                    isDeliveryValidated
                      ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-700"
                      : !canValidateDelivery
                      ? "bg-gray-50 border-gray-200 dark:bg-gray-900/10 dark:border-gray-700"
                      : "bg-orange-50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isDeliveryValidated ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : !canValidateDelivery ? (
                      <FaTimes className="text-gray-600" />
                    ) : (
                      <FaCamera className="text-orange-600" />
                    )}
                    <span
                      className={`font-medium ${
                        isDeliveryValidated
                          ? "text-green-800 dark:text-green-400"
                          : !canValidateDelivery
                          ? "text-gray-600 dark:text-gray-400"
                          : "text-orange-800 dark:text-orange-400"
                      }`}
                    >
                      {isDeliveryValidated
                        ? " Delivery has been validated - Transaction completed!"
                        : !canValidateDelivery
                        ? " Validate pickup first to unlock delivery validation"
                        : " Ready for delivery validation"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* No Photos Message */}
            {!pickupPhoto && !deliveryPhoto && (
              <div className="bg-[#efe8d2] dark:bg-[#67412c] rounded-lg p-8 text-center">
                <FaCamera
                  size={48}
                  className="mx-auto text-[#996936] dark:text-[#d0b274] mb-4"
                />
                <h3 className="text-lg font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
                  No Photos Available
                </h3>
                <p className="text-[#996936] dark:text-[#d0b274]">
                  The delivery rider hasn't uploaded any photos for this
                  transaction yet.
                </p>
              </div>
            )}

            {/* Validation Summary */}
            {(pickupPhoto || deliveryPhoto) && (
              <div className="bg-[#e1d0a7] dark:bg-[#7a4e2e] rounded-lg p-4">
                <h4 className="font-semibold text-[#7a4e2e] dark:text-[#e1d0a7] mb-3">
                  Validation Status Summary:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pickupPhoto && (
                    <div className="flex items-center gap-2">
                      {isPickupValidated ? (
                        <FaCheckCircle className="text-green-600" />
                      ) : (
                        <FaCamera className="text-yellow-600" />
                      )}
                      <span
                        className={`text-sm ${
                          isPickupValidated
                            ? "text-green-700"
                            : "text-yellow-700"
                        }`}
                      >
                        Pickup: {isPickupValidated ? "Validated" : "Pending"}
                      </span>
                    </div>
                  )}
                  {deliveryPhoto && (
                    <div className="flex items-center gap-2">
                      {isDeliveryValidated ? (
                        <FaCheckCircle className="text-green-600" />
                      ) : (
                        <FaCamera className="text-orange-600" />
                      )}
                      <span
                        className={`text-sm ${
                          isDeliveryValidated
                            ? "text-green-700"
                            : "text-orange-700"
                        }`}
                      >
                        Delivery:{" "}
                        {isDeliveryValidated ? "Validated" : "Pending"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#e1d0a7] dark:border-[#7a4e2e]">
              {pickupPhoto && !isPickupValidated && (
                <button
                  onClick={() => handleValidate("pickup")}
                  disabled={isValidating}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    isValidating
                      ? "bg-yellow-400 cursor-not-allowed text-white"
                      : "bg-yellow-500 hover:bg-yellow-600 text-white"
                  }`}
                >
                  <FaCheck />
                  {isValidating ? "Validating Pickup..." : "Validate Pickup"}
                </button>
              )}

              {deliveryPhoto && !isDeliveryValidated && canValidateDelivery && (
                <button
                  onClick={() => handleValidate("delivery")}
                  disabled={isValidating}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    isValidating
                      ? "bg-green-400 cursor-not-allowed text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  <FaCheck />
                  {isValidating
                    ? "Validating Delivery..."
                    : "Complete Transaction"}
                </button>
              )}

              <button
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#996936] hover:bg-[#7a4e2e] text-white rounded-lg font-medium transition-colors"
              >
                <FaTimes />
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {imagePreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <div className="relative max-w-5xl max-h-full w-full h-full flex items-center justify-center">
            <button
              onClick={() => setImagePreview(null)}
              className="absolute top-4 right-4 p-3 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors z-10"
            >
              <FaTimes size={24} />
            </button>
            <img
              src={imagePreview}
              alt="Full size preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg">
              <p className="text-sm">Click outside or press the X to close</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeliveryValidationModal;
