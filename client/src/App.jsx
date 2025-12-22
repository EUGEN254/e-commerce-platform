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

const App = () => {
  const location = useLocation();
  
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]); // Runs when URL path changes

  return (
    <div className="flex flex-col min-h-screen max-w-310 mx-auto">
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'bg-background text-foreground border-border',
        }}
      />

      {/* App Layout */}
      <div>
        <Navbar />

        {/* Main Content */}
        <main>
          <Routes>
            {/* authentication route */}
            <Route path="/create-account" element={<Auth />} />

            {/* main area */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shope />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/product/:id" element={<ProductDescription />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            
            {/* Offer Routes */}
            <Route path="/offers" element={<Offers />} />
            <Route path="/offers/:id" element={<OfferDetails />} />
            
           

           {/* not found route */}
           <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;