import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Coffee, Clock } from "lucide-react";
import axios from "axios";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/userpanel");
    }, 7000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [navigate]);

  // Auto-confirm PayMongo payments (GCash / GrabPay) on return
  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      try {
        const raw = localStorage.getItem("checkoutPayload");
        if (!raw) return;
        const payload = JSON.parse(raw);
        const { provider, sourceId, items, shippingAddress, latitude, longitude } = payload || {};
        if (!sourceId || !["gcash", "grab_pay"].includes(provider)) return;

        // Prevent duplicate submissions
        localStorage.removeItem("checkoutPayload");

        await axios.post(
          `${import.meta.env.VITE_API_URL}/payment/confirm`,
          { sourceId, items, shippingAddress, latitude, longitude },
          { withCredentials: true }
        );
        // Success: nothing else to do; this page already shows success and will redirect.
      } catch (err) {
        console.error("PayMongo confirmation failed:", err);
        // Optional toast could be added here if desired.
      }
    };
    run();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#f9f6ed" }}
    >
      <div className="max-w-md w-full">
        {/* Main Success Card */}
        <div
          className="rounded-2xl shadow-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300"
          style={{ backgroundColor: "#efe8d2" }}
        >
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: "#c1974e" }}
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold mb-4" style={{ color: "#331d15" }}>
            Payment Successful!
          </h1>

          <p
            className="text-lg mb-6 leading-relaxed"
            style={{ color: "#59382a" }}
          >
            Thank you for your order! Your delicious coffee will be prepared as
            soon as possible.
          </p>

          {/* Coffee Icon Decoration */}
          <div className="flex justify-center items-center gap-2 mb-6">
            <Coffee className="w-8 h-8" style={{ color: "#996936" }} />
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: "#b28341",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Order Status */}
          <div
            className="rounded-lg p-4 mb-6"
            style={{ backgroundColor: "#e1d0a7" }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5" style={{ color: "#7a4e2e" }} />
              <span className="font-medium" style={{ color: "#7a4e2e" }}>
                Order Status: Confirmed
              </span>
            </div>
            <p className="text-sm" style={{ color: "#67412c" }}>
              We'll notify you once your order is ready for pickup/delivery
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="space-y-3">
            <p className="text-sm" style={{ color: "#7a4e2e" }}>
              Redirecting to your panel in
            </p>
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-full text-xl font-bold text-white shadow-md"
              style={{ backgroundColor: "#d0b274" }}
            >
              {countdown}
            </div>
          </div>
        </div>

        {/* Skip Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/userpanel")}
            className="text-sm underline hover:no-underline transition-all duration-200"
            style={{ color: "#996936" }}
          >
            Skip and go to panel now
          </button>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-10 left-10 w-20 h-20 rounded-full opacity-20"
          style={{ backgroundColor: "#e1d0a7" }}
        />
        <div
          className="absolute top-20 right-16 w-16 h-16 rounded-full opacity-20"
          style={{ backgroundColor: "#c1974e" }}
        />
        <div
          className="absolute bottom-20 left-20 w-12 h-12 rounded-full opacity-20"
          style={{ backgroundColor: "#b28341" }}
        />
        <div
          className="absolute bottom-32 right-10 w-14 h-14 rounded-full opacity-20"
          style={{ backgroundColor: "#d0b274" }}
        />
      </div>
    </div>
  );
};

export default PaymentSuccess;
