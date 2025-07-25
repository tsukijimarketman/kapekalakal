import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import ScrollToHash from "./ScrollToHash";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import UserNavbar from "../pages/user/UserNavbar";

const Layout = () => {
  const { user } = useAuth();
  return (
    <div>
      {user ? <UserNavbar /> : <Navbar />}
      <ScrollToHash />
      <Outlet />
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Layout;
