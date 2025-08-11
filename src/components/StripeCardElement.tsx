import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { type FormEvent, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

interface StripeCardElementProps {
  totalAmount: number; // Changed from 'amount' to 'totalAmount' to match prop name
  onSuccess: (paymentIntent: any) => void;
  onCancel: () => void;
}

export const StripeCardElement = ({
  totalAmount,
  onSuccess,
  onCancel,
}: StripeCardElementProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>(""); // Added error state
  const [isDisabled, setDisabled] = useState(true); // Added disabled state

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create payment intent
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/stripe/create-payment-intent`,
        {
          amount: Math.round(totalAmount * 100), // Use totalAmount and convert to cents
          metadata: {
            // Add any metadata you need
            orderType: "card_payment",
          },
        },
        { withCredentials: true }
      );

      // 2. Confirm the card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              // You can pre-fill these or collect them from the user
              name: "Customer Name",
              // email, address, etc.
            },
          },
        }
      );

      if (error) {
        throw error;
      }

      if (paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
        onSuccess(paymentIntent);
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-[#e1d0a7] dark:border-[#7a4e2e] rounded-lg p-4 bg-white dark:bg-[#67412c]">
        <CardElement
          options={cardElementOptions}
          onChange={(e) => {
            setError(e.error?.message || "");
            setDisabled(!e.complete);
          }}
        />
      </div>

      {/* Show error if present */}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white dark:bg-[#67412c] border border-[#e1d0a7] dark:border-[#7a4e2e] text-[#7a4e2e] dark:text-white py-2 px-4 rounded-md hover:bg-[#f9f6ed] dark:hover:bg-[#59382a] transition-colors"
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isProcessing || isDisabled || !stripe} // Added validation states
          className={`cursor-pointer flex-1 bg-[#b28341] text-white py-2 px-4 rounded-md hover:bg-[#996936] ${
            isProcessing || isDisabled || !stripe
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {isProcessing ? "Processing..." : `Pay ₱${totalAmount.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
};
