import React, { useState, useEffect } from "react";

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  orderId: string;
}

const CancellationModal: React.FC<CancellationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderId,
}) => {
  const [cancellationReason, setCancellationReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCancellationReason("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle confirm
  const handleConfirm = async () => {
    if (!cancellationReason.trim()) {
      return; // Don't submit if reason is empty
    }

    setIsSubmitting(true);
    try {
      await onConfirm(cancellationReason.trim());
      onClose();
    } catch (error) {
      // Handle error if needed
      console.error("Error cancelling order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setCancellationReason("");
    onClose();
  };

  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && cancellationReason.trim()) {
      e.preventDefault();
      handleConfirm();
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
              className="w-6 h-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            Cancel Order
          </h2>
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="p-2 hover:bg-[#f9f6ed] dark:hover:bg-[#59382a] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Content */}
        <div className="p-6">
          {/* Order Info */}
          <div className="mb-6 p-4 bg-[#f9f6ed] dark:bg-[#59382a] border border-[#e1d0a7] dark:border-[#7a4e2e] rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-[#996936] dark:text-[#d0b274]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                Order #{orderId}
              </span>
            </div>
            <p className="text-sm text-[#996936] dark:text-[#d0b274]">
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>
          </div>

          {/* Cancellation Reason Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
              Reason for cancellation <span className="text-red-500">*</span>
            </label>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Please provide a reason for cancelling this order..."
              rows={4}
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-lg border border-[#e1d0a7] dark:border-[#7a4e2e] bg-white dark:bg-[#59382a] text-[#59382a] dark:text-[#f9f6ed] placeholder-[#996936] dark:placeholder-[#d0b274] focus:outline-none focus:ring-2 focus:ring-[#b28341] focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#996936] dark:text-[#d0b274]">
                {cancellationReason.length}/500 characters
              </span>
              {!cancellationReason.trim() && (
                <span className="text-xs text-red-500">
                  Cancellation reason is required
                </span>
              )}
            </div>
          </div>

          {/* Warning Message */}
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400">
                  Important Notice
                </p>
                <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                  Once cancelled, this order cannot be restored. Any payments
                  will be processed for refund according to our refund policy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 bg-[#f9f6ed] dark:bg-[#59382a] border-t border-[#e1d0a7] dark:border-[#7a4e2e]">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 bg-white dark:bg-[#67412c] border border-[#e1d0a7] dark:border-[#7a4e2e] text-[#7a4e2e] dark:text-[#e1d0a7] font-medium rounded-lg hover:bg-[#f9f6ed] dark:hover:bg-[#59382a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Keep Order
          </button>
          <button
            onClick={handleConfirm}
            disabled={!cancellationReason.trim() || isSubmitting}
            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Cancelling...
              </>
            ) : (
              "Cancel Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancellationModal;
