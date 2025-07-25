import React from "react";
import { ToastContainer } from "react-toastify";
import UserNavbar from "./UserNavbar";
import ScrollToHash from "../../components/ScrollToHash";
import Footer from "../../components/Footer";

const UserLayout = ({ children }: { children: React.ReactNode }) => (
  <div>
    <UserNavbar />
    <ScrollToHash />
    {children}
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

export default UserLayout;
