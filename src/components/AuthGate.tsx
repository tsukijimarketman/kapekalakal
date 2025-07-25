import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import Lottie from "./Lottie"; // Your loading animation

// const redirectMap = {
//   admin: "/admin",
//   delivery: "/delivery",
//   user: "/user",
// };

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show your Lottie loader while checking token
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Lottie />
      </div>
    );
  }

  // If user is authenticated and on a public route, redirect to dashboard
  // if (
  //   user &&
  //   (location.pathname === "/" ||
  //     location.pathname === "/signin" ||
  //     location.pathname === "/signup")
  // ) {
  //   return <Navigate to={redirectMap[user.role]} replace />;
  // }

  if (
    user &&
    (location.pathname === "/signin" || location.pathname === "/signup")
  ) {
    return <Navigate to="/user" replace />;
  }

  // Otherwise, render children (public routes)
  return <>{children}</>;
};

export default AuthGate;
