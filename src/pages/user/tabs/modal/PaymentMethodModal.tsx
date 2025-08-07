import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPaymentMethod: string;
  onSave: (paymentMethod: string) => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  isOpen,
  onClose,
  currentPaymentMethod,
  onSave,
}) => {
  const [selectedMethod, setSelectedMethod] =
    useState<string>(currentPaymentMethod);

  const paymentMethods = [
    {
      id: "gcash",
      name: "GCash",
      icon: (
        <div className="w-8 h-8 bg-[#007dfe] rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">G</span>
        </div>
      ),
    },
    {
      id: "paymaya",
      name: "PayMaya",
      icon: (
        <div className="w-8 h-8 bg-[#00d4ff] rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">P</span>
        </div>
      ),
    },
    {
      id: "visa",
      name: "Visa",
      icon: (
        <div className="w-8 h-8 bg-[#1a1f71] rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">V</span>
        </div>
      ),
    },
    {
      id: "mastercard",
      name: "MasterCard",
      icon: (
        <div className="w-8 h-8 bg-[#eb001b] rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">M</span>
        </div>
      ),
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: (
        <div className="w-8 h-8 bg-[#b28341] rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      ),
    },
  ];

  // Update selected method when currentPaymentMethod changes
  useEffect(() => {
    setSelectedMethod(currentPaymentMethod);
  }, [currentPaymentMethod]);

  // Handle save
  const handleSave = () => {
    onSave(selectedMethod);
    toast.success("Payment method updated successfully");
    onClose();
  };

  // Handle cancel
  const handleCancel = () => {
    setSelectedMethod(currentPaymentMethod); // Reset to original value
    onClose();
  };

  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#67412c] rounded-xl border border-[#e1d0a7] dark:border-[#7a4e2e] shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e1d0a7] dark:border-[#7a4e2e]">
          <h2 className="text-xl font-bold text-[#7a4e2e] dark:text-[#e1d0a7] flex items-center gap-2">
            <svg
              className="w-6 h-6 text-[#b28341]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            Select Payment Method
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-[#f9f6ed] dark:hover:bg-[#59382a] rounded-lg transition-colors"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Payment Methods List */}
        <div className="p-6 space-y-3">
          <div className="text-sm text-[#996936] dark:text-[#d0b274] mb-4">
            Choose your preferred payment method:
          </div>

          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className="flex items-center gap-4 p-4 bg-[#f9f6ed] dark:bg-[#59382a] border border-[#e1d0a7] dark:border-[#7a4e2e] rounded-lg cursor-pointer hover:bg-white dark:hover:bg-[#67412c] transition-colors"
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-5 h-5 text-[#b28341] bg-white dark:bg-[#67412c] border-[#e1d0a7] dark:border-[#7a4e2e] focus:ring-[#b28341] focus:ring-2"
              />

              <div className="flex items-center gap-3 flex-1">
                {method.icon}
                <span className="text-[#59382a] dark:text-[#f9f6ed] font-medium">
                  {method.name}
                </span>
              </div>

              {selectedMethod === method.id && (
                <svg
                  className="w-5 h-5 text-[#b28341]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 bg-[#f9f6ed] dark:bg-[#59382a] border-t border-[#e1d0a7] dark:border-[#7a4e2e]">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 px-4 bg-white dark:bg-[#67412c] border border-[#e1d0a7] dark:border-[#7a4e2e] text-[#7a4e2e] dark:text-[#e1d0a7] font-medium rounded-lg hover:bg-[#f9f6ed] dark:hover:bg-[#59382a] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 bg-[#b28341] hover:bg-[#996936] text-white font-medium rounded-lg transition-colors"
          >
            Save Method
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
