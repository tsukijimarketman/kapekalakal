import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Products from "./components/Products";
import Signup from "./services/auth/Signup";
import Signin from "./services/auth/Signin";
import AuthGate from "./components/AuthGate";
import UserLayout from "./pages/user/UserLayout";

// import Admin from "./pages/admin/Admin";
// import Delivery from "./pages/delivery/Delivery";

// Root component that provides AuthContext within Router
const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        // Wrap public routes with AuthGate
        element: (
          <AuthGate>
            <Layout />
          </AuthGate>
        ),
        children: [
          { path: "/", element: <Home /> },
          { path: "/about", element: <About /> },
          { path: "/products", element: <Products /> },
          { path: "/contact", element: <Contact /> },
        ],
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/user",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <UserLayout>
              <Home />
            </UserLayout>
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "/admin",
      //   element: (
      //     <ProtectedRoute allowedRoles={['admin']}>
      //       <Admin />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "/delivery",
      //   element: (
      //     <ProtectedRoute allowedRoles={['delivery']}>
      //       <Delivery />
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
