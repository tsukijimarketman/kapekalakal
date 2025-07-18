import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Theme detection hook
const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(matchMedia.matches);

    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };

    matchMedia.addEventListener("change", handleChange);

    return () => {
      matchMedia.removeEventListener("change", handleChange);
    };
  }, []);

  return isDarkMode;
};

// Toastify component
const CustomToast = ({ type, message }) => {
  const isDarkMode = useTheme();

  // Define colors based on type
  const toastColors = {
    success: "#28a745",
    warning: "#ffc107",
    info: "#6c757d",
    error: "#dc3545",
  };

  const backgroundColor = toastColors[type] || "#6c757d"; // Default to gray if not matched
  const progressBarColor = backgroundColor;

  // Show toast on mount
  useEffect(() => {
    toast[type](message, {
      position: "top-right",
      autoClose: 5000, // 5 seconds
      hideProgressBar: false,
      progressClassName: "progress-bar",
      style: {
        backgroundColor: isDarkMode ? "#333" : "#fff", // Dark mode vs Light mode
        color: isDarkMode ? "#fff" : "#333",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      },
      progressStyle: {
        backgroundColor: progressBarColor,
        height: "4px",
      },
    });
  }, [message, type, isDarkMode, progressBarColor]);

  return <ToastContainer />;
};

export default CustomToast;
