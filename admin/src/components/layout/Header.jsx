// src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaBell,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaUserCircle,
  FaCog,
  FaQuestionCircle,
  FaGlobe,
} from "react-icons/fa";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      text: "New order received",
      time: "5 min ago",
      read: false,
      type: "order",
    },
    {
      id: 2,
      text: "User John Doe registered",
      time: "10 min ago",
      read: false,
      type: "user",
    },
    {
      id: 3,
      text: "Payment of $250 received",
      time: "1 hour ago",
      read: true,
      type: "payment",
    },
    {
      id: 4,
      text: "Product low in stock",
      time: "2 hours ago",
      read: true,
      type: "alert",
    },
  ];

  // Mock messages data
  const messages = [
    {
      id: 1,
      text: "Customer support request",
      time: "15 min ago",
      sender: "John Smith",
    },
    {
      id: 2,
      text: "Feedback about product",
      time: "30 min ago",
      sender: "Jane Doe",
    },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search logic here
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const unreadMessages = messages.length; // Assuming all messages are unread for demo

  return (
    <header className="bg-white shadow-md p-3 ">
      <div className="h-full px-3 flex items-center justify-between">
        {/* Left Section - Sidebar Toggle & Search */}
        <div className="flex items-center space-x-6">
          {/* Sidebar Toggle Button (for mobile/tablet) */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <FaTimes className="text-gray-600 text-lg" />
            ) : (
              <FaBars className="text-gray-600 text-lg" />
            )}
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:block relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users, products, orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-60 lg:w-101 text-sm px-3 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1 px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Right Section - Icons & Profile */}
        <div className="flex items-center space-x-4 mr-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <FaSun className="text-yellow-500 text-sm" />
            ) : (
              <FaMoon className="text-gray-600 text-sm" />
            )}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-1">
              <FaGlobe className="text-gray-600" />
              <span className="text-sm font-medium hidden lg:inline">EN</span>
            </button>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <FaBell className="text-gray-600 text-sm" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  <p className="text-sm text-gray-500">
                    {unreadNotifications} unread
                  </p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-full ${
                            notification.type === "order"
                              ? "bg-green-100 text-green-600"
                              : notification.type === "user"
                              ? "bg-blue-100 text-blue-600"
                              : notification.type === "payment"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          <FaBell className="text-sm" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {notification.text}
                          </p>
                          <p className="text-sm text-gray-500">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100">
                  <button className="w-full text-center text-blue-600 hover:text-blue-800 font-medium py-2">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Messages Dropdown */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <FaEnvelope className="text-gray-600 text-sm" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </button>
          </div>

          {/* Help */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden lg:block"
            title="Help"
          >
            <FaQuestionCircle className="text-gray-600 text-lg" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FaUserCircle className="text-white text-1xl" />
              </div>
              <div className="text-left hidden lg:block">
                <p className="font-medium text-gray-800 text-sm">Admin User</p>
                <p className="text-xs text-gray-500 ">Super Admin</p>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <FaUserCircle className="text-white text-3xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Admin User</p>
                      <p className="text-sm text-gray-500">admin@example.com</p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <a
                    href="/profile"
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-gray-700"
                  >
                    <FaUserCircle className="text-gray-500" />
                    <span>My Profile</span>
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-gray-700"
                  >
                    <FaCog className="text-gray-500" />
                    <span>Settings</span>
                  </a>
                </div>

                <div className="p-3 border-t border-gray-100">
                  <button className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-medium py-2 rounded-lg transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
