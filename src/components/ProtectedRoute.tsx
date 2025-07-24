import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Lottie from "./Lottie";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("user" | "admin" | "delivery")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ["user", "admin", "delivery"],
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Lottie />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectMap = {
      admin: "/admin",
      delivery: "/delivery",
      user: "/user",
    };
    return <Navigate to={redirectMap[user.role]} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
