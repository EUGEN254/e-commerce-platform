import React, { useState } from "react";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { FaPersonBooth } from "react-icons/fa";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "My Orders", path: "/my-orders" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className=" mt-2 mb-4">
      {/* Main Navbar - Stays rounded-full */}
      <nav className="bg-white shadow-lg p-2 rounded-full">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-xl font-bold text-indigo-600 pl-3">
            <h1>ShopHub</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-45">
            <div className="flex space-x-5">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="text-gray-700 hover:text-indigo-600 text-sm font-medium 
                 relative group"
                >
                  {link.name}
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 
                      transition-all duration-300 group-hover:w-full"
                  ></span>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-6">
              <button className="relative flex justify-between items-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 right-18 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  3
                </span>
                <span className="text-sm">View Cart</span>
              </button>

              {user ? (
                <button className="btn-secondary flex items-center space-x-1 text-xs">
                  <User className="w-4 h-4" />
                  <span onClick={() => navigate("/profile")}>Profile</span>
                </button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => navigate("/create-account")}
                  className="text-xs"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Create Account
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Header Icons */}
          <div className="md:hidden flex items-center space-x-3">
            <button className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-indigo-600" />
              ) : (
                <Menu className="w-6 h-6 text-indigo-600" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "max-h-96 opacity-100 mt-2"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 space-y-3">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="block py-3 px-4 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <div className="border-t border-gray-100 pt-3 space-y-2">
            <button className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
              <ShoppingCart className="w-4 h-4 mr-2" />
              View Cart (3)
            </button>

            {!user ? (
              <button className="w-full flex items-center justify-center py-3 px-4 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </button>
            ) : (
              <button className="w-full py-3 px-4 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium">
                Create Account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
