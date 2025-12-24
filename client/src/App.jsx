import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Shope from "./pages/Shope";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import ProductDescription from "./pages/ProductDescription";
import Auth from "./pages/Auth";
import { Toaster } from "./components/ui/sonner";
import { Cart } from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Offers from "./pages/Offers";
import OfferDetails from "./pages/OfferDetails";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";

const App = () => {
  const location = useLocation();

  // Optionally hide navbar/footer on auth routes
  const hideLayoutPaths = [
    "/create-account",
    "/reset-password",
    "/login",
    "/auth",
  ];
  const hideLayout = hideLayoutPaths.some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <div className="flex flex-col min-h-screen max-w-310 mx-auto">
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          className: "bg-background text-foreground border-border",
        }}
      />

      {/* App Layout */}
      <div className="flex-1 flex flex-col">
        {!hideLayout && <Navbar />}

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            {/* Authentication routes - No ProtectedRoute to prevent flash */}

            <Route
              path="/create-account"
              element={
                <ProtectedRoute requireAuth={false}>
                  <Auth />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <ProtectedRoute requireAuth={false}>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />

            {/* Main area - Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shope />} />
            <Route path="/shop/:category" element={<Shope />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:id" element={<ProductDescription />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/offers/:id" element={<OfferDetails />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* Protected routes - Require authentication */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />

            {/* Not found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {!hideLayout && <Footer />}
      </div>
    </div>
  );
};

export default App;
