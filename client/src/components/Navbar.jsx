import React, { useState } from "react";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
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
          <div className="hidden md:flex items-center space-x-4">
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

            <div className="flex items-center space-x-3">
              <button className="relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  3
                </span>
              </button>

              {!user ? (
                <button className="btn-secondary flex items-center space-x-1 text-xs">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
              ) : (
                <button className="btn-secondary text-xs">
                  Create Account
                </button>
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
