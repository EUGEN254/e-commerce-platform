import React, { useState } from "react";
import {
  FaSearch,
  FaFilter,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaBox,
  FaDownload,
  FaShoppingBag,
  FaCreditCard,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaEye,
  FaRedo,
  FaPrint,
  FaWhatsapp,
  FaCalendarAlt,
} from "react-icons/fa";

const MyOrders = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Orders data
  const orders = [
    {
      id: "ORD-78901",
      date: "Nov 15, 2023",
      status: "delivered",
      statusText: "Delivered",
      total: 189.99,
      items: [
        { name: "Premium Running Shoes", quantity: 1, price: 89.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" },
        { name: "Sports T-Shirt", quantity: 2, price: 49.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop" },
      ],
      shipping: {
        address: "123 Shopping Street, New York, NY 10001",
        method: "Express Shipping",
        estimated: "Nov 18, 2023",
        delivered: "Nov 17, 2023",
        tracking: "TRK78901234",
        carrier: "FedEx",
      },
      payment: {
        method: "Visa ****1234",
        status: "Paid",
        total: 189.99,
        subtotal: 139.97,
        shipping: 9.99,
        tax: 11.03,
        discount: 29.00,
      },
    },
    {
      id: "ORD-78900",
      date: "Nov 10, 2023",
      status: "processing",
      statusText: "Processing",
      total: 89.99,
      items: [
        { name: "Wireless Earbuds", quantity: 1, price: 89.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" },
      ],
      shipping: {
        address: "456 Park Avenue, Brooklyn, NY 11201",
        method: "Standard Shipping",
        estimated: "Nov 15, 2023",
        tracking: "TRK78901233",
        carrier: "USPS",
      },
      payment: {
        method: "PayPal",
        status: "Paid",
        total: 89.99,
        subtotal: 79.99,
        shipping: 5.99,
        tax: 4.01,
      },
    },
    {
      id: "ORD-78899",
      date: "Nov 5, 2023",
      status: "shipped",
      statusText: "Shipped",
      total: 249.99,
      items: [
        { name: "Smart Watch Pro", quantity: 1, price: 249.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" },
      ],
      shipping: {
        address: "123 Shopping Street, New York, NY 10001",
        method: "Express Shipping",
        estimated: "Nov 8, 2023",
        tracking: "TRK78901232",
        carrier: "UPS",
      },
      payment: {
        method: "Mastercard ****5678",
        status: "Paid",
        total: 249.99,
        subtotal: 229.99,
        shipping: 9.99,
        tax: 10.01,
      },
    },
    {
      id: "ORD-78898",
      date: "Oct 28, 2023",
      status: "delivered",
      statusText: "Delivered",
      total: 149.99,
      items: [
        { name: "Designer Backpack", quantity: 1, price: 79.99, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
        { name: "Laptop Sleeve", quantity: 1, price: 29.99, image: "https://images.unsplash.com/photo-1586950012036-b957f2c7cbf3?w=200&h=200&fit=crop" },
        { name: "USB-C Cable", quantity: 1, price: 19.99, image: "https://images.unsplash.com/photo-1581961454223-85d2182e2b9b?w=200&h=200&fit=crop" },
      ],
      shipping: {
        address: "123 Shopping Street, New York, NY 10001",
        method: "Standard Shipping",
        estimated: "Nov 2, 2023",
        delivered: "Nov 1, 2023",
        tracking: "TRK78901231",
        carrier: "USPS",
      },
      payment: {
        method: "Visa ****1234",
        status: "Paid",
        total: 149.99,
        subtotal: 129.97,
        shipping: 5.99,
        tax: 14.03,
      },
    },
    {
      id: "ORD-78897",
      date: "Oct 20, 2023",
      status: "cancelled",
      statusText: "Cancelled",
      total: 79.99,
      items: [
        { name: "Bluetooth Speaker", quantity: 1, price: 79.99, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&h=200&fit=crop" },
      ],
      shipping: {
        address: "123 Shopping Street, New York, NY 10001",
        method: "Standard Shipping",
        status: "Cancelled",
      },
      payment: {
        method: "Visa ****1234",
        status: "Refunded",
        total: 79.99,
        refunded: "Oct 21, 2023",
      },
    },
    {
      id: "ORD-78896",
      date: "Oct 15, 2023",
      status: "returned",
      statusText: "Returned",
      total: 199.99,
      items: [
        { name: "Gaming Mouse", quantity: 1, price: 79.99, image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&h=200&fit=crop" },
        { name: "Mechanical Keyboard", quantity: 1, price: 119.99, image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=200&h=200&fit=crop" },
      ],
      shipping: {
        address: "123 Shopping Street, New York, NY 10001",
        method: "Standard Shipping",
        status: "Returned",
        returnDate: "Oct 25, 2023",
      },
      payment: {
        method: "PayPal",
        status: "Refunded",
        total: 199.99,
        refunded: "Oct 26, 2023",
      },
    },
  ];

  // Filters
  const filters = [
    { id: "all", label: "All Orders", count: orders.length },
    { id: "delivered", label: "Delivered", count: orders.filter(o => o.status === "delivered").length },
    { id: "processing", label: "Processing", count: orders.filter(o => o.status === "processing").length },
    { id: "shipped", label: "Shipped", count: orders.filter(o => o.status === "shipped").length },
    { id: "cancelled", label: "Cancelled", count: orders.filter(o => o.status === "cancelled").length },
    { id: "returned", label: "Returned", count: orders.filter(o => o.status === "returned").length },
  ];

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (activeFilter !== "all" && order.status !== activeFilter) return false;
    if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case "delivered":
        return { icon: <FaCheckCircle />, color: "bg-green-100 text-green-800", border: "border-green-200" };
      case "processing":
        return { icon: <FaClock />, color: "bg-amber-100 text-amber-800", border: "border-amber-200" };
      case "shipped":
        return { icon: <FaTruck />, color: "bg-blue-100 text-blue-800", border: "border-blue-200" };
      case "cancelled":
        return { icon: <FaTimesCircle />, color: "bg-red-100 text-red-800", border: "border-red-200" };
      case "returned":
        return { icon: <FaRedo />, color: "bg-purple-100 text-purple-800", border: "border-purple-200" };
      default:
        return { icon: <FaBox />, color: "bg-gray-100 text-gray-800", border: "border-gray-200" };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-5 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">My Orders</h1>
              <p className="text-indigo-100">Track and manage all your orders in one place</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{orders.length} Orders</div>
              <div className="text-indigo-200">Total spent: ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 lg:px-20 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Search and Filters */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Date Filter */}
              <div className="relative">
                <input
                  type="date"
                  className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    activeFilter === filter.id
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="font-medium">{filter.label}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeFilter === filter.id
                      ? "bg-white/20"
                      : "bg-gray-200"
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-bold text-gray-800">{order.id}</h2>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} ${statusInfo.border} border flex items-center gap-1`}>
                              {statusInfo.icon}
                              {order.statusText}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt className="w-4 h-4" />
                              {order.date}
                            </span>
                            <span>•</span>
                            <span>{order.items.length} items</span>
                            <span>•</span>
                            <span className="font-bold text-gray-800">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                          >
                            <FaEye className="w-4 h-4" />
                            View Details
                          </button>
                          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Track
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="p-6">
                      <div className="flex flex-wrap gap-4">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            />
                            <div>
                              <h4 className="font-medium text-gray-800">{item.name}</h4>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="flex items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                +{order.items.length - 3} more
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Order Actions */}
                      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
                        {order.status === "delivered" && (
                          <>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                              <FaStar className="w-4 h-4" />
                              Write Review
                            </button>
                            <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                              Buy Again
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                              <FaDownload className="w-4 h-4" />
                              Invoice
                            </button>
                          </>
                        )}
                        {order.status === "shipped" && (
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Track Order
                          </button>
                        )}
                        {order.status === "processing" && (
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            Cancel Order
                          </button>
                        )}
                        {order.status === "cancelled" && (
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            Re-order
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Order Details Expandable */}
                    {selectedOrder?.id === order.id && (
                      <div className="border-t border-gray-200">
                        <div className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Order Items */}
                            <div>
                              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaShoppingBag className="w-5 h-5 text-indigo-600" />
                                Order Items
                              </h3>
                              <div className="space-y-4">
                                {order.items.map((item, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-12 h-12 object-cover rounded border border-gray-200"
                                      />
                                      <div>
                                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-bold text-gray-800">
                                        ${(item.price * item.quantity).toFixed(2)}
                                      </div>
                                      <div className="text-sm text-gray-600">${item.price.toFixed(2)} each</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping & Payment */}
                            <div className="space-y-6">
                              {/* Shipping Info */}
                              <div>
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                  <FaTruck className="w-5 h-5 text-green-600" />
                                  Shipping Information
                                </h3>
                                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                                  <div className="flex items-start gap-3">
                                    <FaMapMarkerAlt className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="font-medium text-gray-800">Delivery Address</p>
                                      <p className="text-gray-600">{order.shipping.address}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <FaTruck className="w-5 h-5 text-gray-400" />
                                    <div>
                                      <p className="font-medium text-gray-800">Shipping Method</p>
                                      <p className="text-gray-600">{order.shipping.method}</p>
                                    </div>
                                  </div>
                                  {order.shipping.tracking && (
                                    <div className="flex items-center gap-3">
                                      <FaBox className="w-5 h-5 text-gray-400" />
                                      <div>
                                        <p className="font-medium text-gray-800">Tracking Number</p>
                                        <p className="text-gray-600">{order.shipping.tracking} ({order.shipping.carrier})</p>
                                      </div>
                                    </div>
                                  )}
                                  {order.shipping.estimated && (
                                    <div className="flex items-center gap-3">
                                      <FaCalendarAlt className="w-5 h-5 text-gray-400" />
                                      <div>
                                        <p className="font-medium text-gray-800">Estimated Delivery</p>
                                        <p className="text-gray-600">{order.shipping.estimated}</p>
                                      </div>
                                    </div>
                                  )}
                                  {order.shipping.delivered && (
                                    <div className="flex items-center gap-3">
                                      <FaCheckCircle className="w-5 h-5 text-green-400" />
                                      <div>
                                        <p className="font-medium text-gray-800">Delivered On</p>
                                        <p className="text-gray-600">{order.shipping.delivered}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Payment Info */}
                              <div>
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                  <FaCreditCard className="w-5 h-5 text-blue-600" />
                                  Payment Details
                                </h3>
                                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${order.payment.subtotal?.toFixed(2)}</span>
                                  </div>
                                  {order.payment.discount && (
                                    <div className="flex justify-between text-green-600">
                                      <span>Discount</span>
                                      <span>-${order.payment.discount.toFixed(2)}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">${order.payment.shipping?.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium">${order.payment.tax?.toFixed(2)}</span>
                                  </div>
                                  <div className="border-t border-gray-200 pt-2 mt-2">
                                    <div className="flex justify-between font-bold text-lg">
                                      <span>Total</span>
                                      <span>${order.payment.total.toFixed(2)}</span>
                                    </div>
                                  </div>
                                  <div className="pt-2 border-t border-gray-200">
                                    <div className="flex items-center gap-2">
                                      <FaCreditCard className="w-4 h-4 text-gray-400" />
                                      <span className="text-gray-600">Payment Method: {order.payment.method}</span>
                                    </div>
                                    <div className={`inline-block mt-2 px-2 py-1 rounded text-sm ${
                                      order.payment.status === "Paid"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}>
                                      {order.payment.status}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                              <FaPrint className="w-4 h-4" />
                              Print Invoice
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                              <FaDownload className="w-4 h-4" />
                              Download Invoice
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                              <FaWhatsapp className="w-4 h-4" />
                              Contact Support
                            </button>
                            {order.status === "delivered" && (
                              <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                Request Return
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <FaBox className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery
                    ? "No orders match your search criteria"
                    : "You haven't placed any orders yet"}
                </p>
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* Order Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-800">{orders.length}</div>
                  <div className="text-gray-600">Total Orders</div>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <FaShoppingBag className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </div>
                  <div className="text-gray-600">Total Spent</div>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FaCreditCard className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {orders.filter(o => o.status === "delivered").length}
                  </div>
                  <div className="text-gray-600">Delivered</div>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaTruck className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {orders.filter(o => o.status === "processing" || o.status === "shipped").length}
                  </div>
                  <div className="text-gray-600">In Progress</div>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <FaClock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="px-5 lg:px-20 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Need help with your order?</h3>
                <p className="text-gray-600">Our support team is here to help you 24/7</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  <FaPhone className="w-5 h-5" />
                  Call Support
                </button>
                <button className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2">
                  <FaEnvelope className="w-5 h-5" />
                  Email Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;