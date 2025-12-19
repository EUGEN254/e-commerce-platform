import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Shope from "./pages/Shope";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import ProductDescription from "./pages/ProductDescription";
import Auth from "./pages/Auth";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen max-w-310 mx-auto">
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      {/* App Layout */}
      <div>
        <Navbar />

        {/* Main Content */}
        <main>
          <Routes>
            {/* authenitication route */}
            <Route path="/create-account" element={<Auth />} />

            {/* main area */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shope />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/product/:id" element={<ProductDescription />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
