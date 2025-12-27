import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
  FaShoppingBag,
  FaHeart,
  FaEye,
  FaStar,
  FaCheckCircle,
  FaTruck,
  FaCreditCard,
  FaBell,
  FaShieldAlt,
  FaLock,
  FaSignOutAlt,
  FaCamera,
  FaUserCircle,
  FaBoxOpen,
  FaHistory,
  FaGift,
} from "react-icons/fa";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePhoto, setShowChangePhoto] = useState(false);

  // User data
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (234) 567-8900",
    address: "123 Shopping Street, New York, NY 10001",
    joinDate: "January 15, 2022",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
  });

  // Orders data
  const orders = [
    {
      id: "#ORD-78901",
      date: "Nov 15, 2023",
      status: "Delivered",
      total: 189.99,
      items: 3,
      tracking: "TRK78901234",
    },
    {
      id: "#ORD-78900",
      date: "Nov 10, 2023",
      status: "Processing",
      total: 89.99,
      items: 1,
      tracking: "TRK78901233",
    },
    {
      id: "#ORD-78899",
      date: "Nov 5, 2023",
      status: "Shipped",
      total: 249.99,
      items: 4,
      tracking: "TRK78901232",
    },
    {
      id: "#ORD-78898",
      date: "Oct 28, 2023",
      status: "Delivered",
      total: 149.99,
      items: 2,
      tracking: "TRK78901231",
    },
  ];

  // Wishlist items
  const wishlist = [
    {
      id: 1,
      name: "Premium Running Shoes",
      price: 89.99,
      originalPrice: 119.99,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Wireless Headphones",
      price: 129.99,
      originalPrice: 159.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Smart Watch",
      price: 249.99,
      originalPrice: 299.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      rating: 4.3,
    },
    {
      id: 4,
      name: "Designer Backpack",
      price: 79.99,
      originalPrice: 99.99,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      rating: 4.6,
    },
  ];

  // Recently viewed
  const recentlyViewed = [
    {
      id: 5,
      name: "Laptop Stand",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1586950012036-b957f2c7cbf3?w=400&h=400&fit=crop",
      viewed: "2 hours ago",
    },
    {
      id: 6,
      name: "Coffee Maker",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
      viewed: "1 day ago",
    },
    {
      id: 7,
      name: "Yoga Mat",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=400&fit=crop",
      viewed: "3 days ago",
    },
  ];

  // Stats
  const stats = [
    { label: "Total Orders", value: "24", icon: <FaShoppingBag />, color: "bg-blue-500" },
    { label: "Wishlist Items", value: "12", icon: <FaHeart />, color: "bg-pink-500" },
    { label: "Reviews", value: "8", icon: <FaStar />, color: "bg-amber-500" },
    { label: "Loyalty Points", value: "1,250", icon: <FaGift />, color: "bg-purple-500" },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Payment methods
  const paymentMethods = [
    { type: "Visa", number: "**** **** **** 1234", default: true },
    { type: "Mastercard", number: "**** **** **** 5678", default: false },
    { type: "PayPal", email: "john@example.com", default: false },
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    // TODO: send `userData` to backend save endpoint
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-5 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Account</h1>
          <p className="text-indigo-100">Manage your profile, orders, and preferences</p>
        </div>
      </div>

      <div className="px-5 lg:px-20 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
                <div className="relative mb-6">
                  <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={userData.avatar}
                      alt={userData.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setShowChangePhoto(true)}
                      className="absolute bottom-2 right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                    >
                      <FaCamera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-center mt-4">
                    <h2 className="text-xl font-bold text-gray-800">{userData.name}</h2>
                    <p className="text-gray-600 text-sm">{userData.email}</p>
                    <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      <FaCheckCircle className="w-4 h-4" />
                      Verified Account
                    </div>
                  </div>
                </div>

                {/* Sidebar Navigation */}
                <nav className="space-y-2">
                  {[
                    { id: "overview", label: "Overview", icon: <FaUser /> },
                    { id: "orders", label: "My Orders", icon: <FaShoppingBag /> },
                    { id: "wishlist", label: "Wishlist", icon: <FaHeart /> },
                    { id: "viewed", label: "Recently Viewed", icon: <FaEye /> },
                    { id: "address", label: "Addresses", icon: <FaMapMarkerAlt /> },
                    { id: "payment", label: "Payment Methods", icon: <FaCreditCard /> },
                    { id: "security", label: "Security", icon: <FaShieldAlt /> },
                    { id: "notifications", label: "Notifications", icon: <FaBell /> },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === item.id
                          ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-5 h-5">{item.icon}</div>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button className="w-full flex items-center justify-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <FaSignOutAlt className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${stat.color} text-white`}>
                          {stat.icon}
                        </div>
                        <span className="text-gray-700">{stat.label}</span>
                      </div>
                      <span className="font-bold text-gray-800">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Tab Content */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                {/* Tab Headers */}
                <div className="flex border-b border-gray-200 overflow-x-auto">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "orders", label: "Orders" },
                    { id: "wishlist", label: "Wishlist" },
                    { id: "viewed", label: "Recently Viewed" },
                    { id: "payment", label: "Payment" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-indigo-600 text-indigo-600"
                          : "border-transparent text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {/* Overview Tab */}
                  {activeTab === "overview" && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Profile Overview</h2>
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                          <FaEdit className="w-4 h-4" />
                          {isEditing ? "Cancel Editing" : "Edit Profile"}
                        </button>
                      </div>

                      {isEditing ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                              </label>
                              <input
                                type="text"
                                value={userData.name}
                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                              </label>
                              <input
                                type="email"
                                value={userData.email}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                value={userData.phone}
                                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                              </label>
                              <textarea
                                value={userData.address}
                                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                              />
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={handleSaveProfile}
                              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={() => setIsEditing(false)}
                              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                              <div className="p-3 bg-indigo-100 rounded-full">
                                <FaUser className="w-6 h-6 text-indigo-600" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-800 mb-1">Personal Information</h3>
                                <p className="text-gray-600">{userData.name}</p>
                                <p className="text-gray-600 text-sm">{userData.email}</p>
                                <p className="text-gray-600 text-sm">{userData.phone}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                              <div className="p-3 bg-green-100 rounded-full">
                                <FaCalendarAlt className="w-6 h-6 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-800 mb-1">Member Since</h3>
                                <p className="text-gray-600">{userData.joinDate}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                              <div className="p-3 bg-purple-100 rounded-full">
                                <FaMapMarkerAlt className="w-6 h-6 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-800 mb-1">Primary Address</h3>
                                <p className="text-gray-600">{userData.address}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                              <div className="p-3 bg-amber-100 rounded-full">
                                <FaLock className="w-6 h-6 text-amber-600" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-800 mb-1">Security</h3>
                                <p className="text-gray-600 mb-2">Last password change: 30 days ago</p>
                                <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                                  Change Password
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Orders Tab */}
                  {activeTab === "orders" && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all duration-300"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="font-bold text-gray-800">{order.id}</span>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    order.status === "Delivered"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "Shipped"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}>
                                    {order.status}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm">
                                  Placed on {order.date} • {order.items} items • ${order.total.toFixed(2)}
                                </p>
                                <p className="text-gray-500 text-sm mt-2">
                                  Tracking: {order.tracking}
                                </p>
                              </div>
                              <div className="flex gap-3">
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                                  View Details
                                </button>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                                  Track Order
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Wishlist Tab */}
                  {activeTab === "wishlist" && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {wishlist.map((item) => (
                          <div
                            key={item.id}
                            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-300"
                          >
                            <div className="flex gap-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex">
                                    {renderStars(item.rating)}
                                  </div>
                                  <span className="text-sm text-gray-500">{item.rating}</span>
                                </div>
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="text-xl font-bold text-gray-800">
                                    ${item.price.toFixed(2)}
                                  </span>
                                  {item.originalPrice && (
                                    <span className="text-sm text-gray-500 line-through">
                                      ${item.originalPrice.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm flex-1">
                                    Add to Cart
                                  </button>
                                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    <FaHeart className="w-5 h-5 text-red-500" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recently Viewed Tab */}
                  {activeTab === "viewed" && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Recently Viewed</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentlyViewed.map((item) => (
                          <div
                            key={item.id}
                            className="group border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all duration-300"
                          >
                            <div className="relative h-40 mb-4 overflow-hidden rounded-lg">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <h3 className="font-bold text-gray-800 mb-2">{item.name}</h3>
                            <div className="flex justify-between items-center">
                              <span className="text-xl font-bold text-gray-800">
                                ${item.price.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500">{item.viewed}</span>
                            </div>
                            <button className="w-full mt-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                              View Again
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment Methods Tab */}
                  {activeTab === "payment" && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Payment Methods</h2>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                          Add New Card
                        </button>
                      </div>
                      <div className="space-y-4">
                        {paymentMethods.map((method, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-gray-100 rounded-lg">
                                <FaCreditCard className="w-6 h-6 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-800">{method.type}</h3>
                                <p className="text-gray-600">{method.number || method.email}</p>
                                {method.default && (
                                  <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                    Default
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                Edit
                              </button>
                              <button className="px-3 py-1 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50">
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Security & Preferences Card */}
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FaShieldAlt className="w-5 h-5 text-indigo-600" />
                      Security Settings
                    </h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="font-medium text-gray-800">Two-Factor Authentication</div>
                        <div className="text-sm text-gray-600">Add an extra layer of security</div>
                      </button>
                      <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="font-medium text-gray-800">Login History</div>
                        <div className="text-sm text-gray-600">Review recent account activity</div>
                      </button>
                      <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="font-medium text-gray-800">Connected Devices</div>
                        <div className="text-sm text-gray-600">Manage signed-in devices</div>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FaBell className="w-5 h-5 text-indigo-600" />
                      Notification Preferences
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Email Notifications</span>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">SMS Alerts</span>
                        <input type="checkbox" className="toggle" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Promotional Offers</span>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Order Updates</span>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Photo Modal */}
      {showChangePhoto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Change Profile Photo</h3>
            <div className="space-y-4">
              <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
                <div className="text-center">
                  <FaCamera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="font-medium text-gray-700">Upload New Photo</div>
                  <div className="text-sm text-gray-500">JPG, PNG up to 5MB</div>
                </div>
              </button>
              <button className="w-full p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                <div className="text-center">
                  <FaUserCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="font-medium text-gray-700">Use Default Avatar</div>
                </div>
              </button>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowChangePhoto(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowChangePhoto(false);
                  // Handle photo change logic here
                }}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;