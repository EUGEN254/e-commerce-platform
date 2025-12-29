import React, { useState, useEffect } from "react";
import axios from "axios";
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
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";

const MyOrders = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const { backendUrl } = useCart();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    delivered: 0,
    inProgress: 0,
  });

  useEffect(() => {
    // Scroll to top when MyOrders mounts or when loading finishes
    if (!loading) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [loading]);

  // Fetch orders from database
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${backendUrl}/api/orders/my-orders`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setOrders(response.data.orders);
        calculateStats(response.data.orders);
      } else {
        setError(response.data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const totalOrders = ordersData.length;
    const totalSpent = ordersData.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const delivered = ordersData.filter(
      (o) => o.status === "PAID" || o.status === "FULFILLED"
    ).length;
    const inProgress = ordersData.filter(
      (o) =>
        o.status === "CREATED" ||
        o.status === "PAYMENT_PENDING" ||
        o.status === "PAID"
    ).length;

    setStats({
      totalOrders,
      totalSpent,
      delivered,
      inProgress,
    });
  };

  // Map database status to UI status
  const mapStatusToUI = (dbStatus) => {
    switch (dbStatus) {
      case "CREATED":
      case "PAYMENT_PENDING":
        return { status: "processing", statusText: "Payment Pending" };
      case "PAID":
        return { status: "processing", statusText: "Paid - Processing" };
      case "FULFILLED":
        return { status: "delivered", statusText: "Delivered" };
      case "CANCELLED":
        return { status: "cancelled", statusText: "Cancelled" };
      case "EXPIRED":
        return { status: "cancelled", statusText: "Expired" };
      default:
        return { status: "processing", statusText: dbStatus || "Processing" };
    }
  };

  // Map payment status
  const mapPaymentStatus = (dbStatus) => {
    switch (dbStatus) {
      case "UNPAID":
        return "Pending";
      case "PARTIAL":
        return "Partial";
      case "PAID":
        return "Paid";
      case "REFUNDED":
        return "Refunded";
      default:
        return dbStatus || "Pending";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Use shared formatter

  // Filters based on database status
  const filters = [
    { id: "all", label: "All Orders", count: orders.length },
    {
      id: "delivered",
      label: "Delivered",
      count: orders.filter((o) => o.status === "FULFILLED").length,
    },
    {
      id: "processing",
      label: "Processing",
      count: orders.filter(
        (o) =>
          o.status === "CREATED" ||
          o.status === "PAYMENT_PENDING" ||
          o.status === "PAID"
      ).length,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      count: orders.filter(
        (o) => o.status === "CANCELLED" || o.status === "EXPIRED"
      ).length,
    },
  ];

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (activeFilter !== "all") {
      if (activeFilter === "delivered" && order.status !== "FULFILLED")
        return false;
      if (
        activeFilter === "processing" &&
        !["CREATED", "PAYMENT_PENDING", "PAID"].includes(order.status)
      )
        return false;
      if (
        activeFilter === "cancelled" &&
        !["CANCELLED", "EXPIRED"].includes(order.status)
      )
        return false;
    }

    if (
      searchQuery &&
      !order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case "delivered":
        return {
          icon: <FaCheckCircle />,
          color: "bg-green-100 text-green-800",
          border: "border-green-200",
        };
      case "processing":
        return {
          icon: <FaClock />,
          color: "bg-amber-100 text-amber-800",
          border: "border-amber-200",
        };
      case "cancelled":
        return {
          icon: <FaTimesCircle />,
          color: "bg-red-100 text-red-800",
          border: "border-red-200",
        };
      default:
        return {
          icon: <FaBox />,
          color: "bg-gray-100 text-gray-800",
          border: "border-gray-200",
        };
    }
  };

  // Handle order actions
  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        const response = await axios.put(
          `${backendUrl}/api/orders/${orderId}/cancel`,
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          fetchOrders(); // Refresh orders
        }
      } catch (err) {
        console.error("Error cancelling order:", err);
        alert("Failed to cancel order. Please try again.");
      }
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/orders/${orderId}/invoice`,
        {
          withCredentials: true,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading invoice:", err);
      alert("Failed to download invoice. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <FaExclamationCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Orders
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 px-5 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">My Orders</h1>
              <p className="text-indigo-100 text-sm">
                Track and manage all your orders
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{stats.totalOrders} Orders</div>
              <div className="text-indigo-200 text-sm">
                Spent: {formatCurrency(stats.totalSpent, orders[0]?.currency)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 lg:px-20 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Order Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-gray-800">
                    {stats.totalOrders}
                  </div>
                  <div className="text-gray-600 text-sm">Total Orders</div>
                </div>
                <div className="p-2 bg-indigo-100 rounded-full">
                  <FaShoppingBag className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-gray-800">
                    {formatCurrency(stats.totalSpent, orders[0]?.currency)}
                  </div>
                  <div className="text-gray-600 text-sm">Total Spent</div>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <FaCreditCard className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-gray-800">
                    {stats.delivered}
                  </div>
                  <div className="text-gray-600 text-sm">Completed</div>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <FaCheckCircle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-gray-800">
                    {stats.inProgress}
                  </div>
                  <div className="text-gray-600 text-sm">In Progress</div>
                </div>
                <div className="p-2 bg-amber-100 rounded-full">
                  <FaClock className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white mt-4 rounded-xl p-4 border border-gray-200 shadow-sm mb-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search order number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Date Filter */}
              <div className="relative">
                <input
                  type="date"
                  className="w-full md:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  onChange={(e) => {
                    // Implement date filtering logic here
                  }}
                />
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                    activeFilter === filter.id
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="font-medium">{filter.label}</span>
                  <span
                    className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                      activeFilter === filter.id ? "bg-white/20" : "bg-gray-200"
                    }`}
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const uiStatus = mapStatusToUI(order.status);
                const statusInfo = getStatusInfo(uiStatus.status);
                const paymentStatus = mapPaymentStatus(order.paymentStatus);

                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <h2 className="text-lg font-bold text-gray-800">
                              {order.orderNumber?.slice(0, 8)}...
                            </h2>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.border} border flex items-center gap-1`}
                            >
                              {statusInfo.icon}
                              {uiStatus.statusText}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-xs ${
                                paymentStatus === "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : paymentStatus === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {paymentStatus}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt className="w-3 h-3" />
                              {formatDate(order.createdAt)}
                            </span>
                            <span>•</span>
                            <span>{order.items?.length || 0} items</span>
                            <span>•</span>
                            <span className="font-bold text-gray-800">
                              {formatCurrency(
                                order.totalAmount,
                                order.currency
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setSelectedOrder(
                                selectedOrder?._id === order._id ? null : order
                              )
                            }
                            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5 text-sm"
                          >
                            <FaEye className="w-3.5 h-3.5" />
                            View
                          </button>
                          {(order.status === "PAID" ||
                            order.status === "FULFILLED") && (
                            <button
                              onClick={() => handleDownloadInvoice(order._id)}
                              className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            >
                              Invoice
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="p-4">
                      <div className="flex flex-wrap gap-3">
                        {order.items?.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                <FaBox className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <h4 className="font-medium text-gray-800 text-sm">
                                {item.name}
                              </h4>
                              <p className="text-xs text-gray-600">
                                Qty: {item.quantity} ×{" "}
                                {formatCurrency(item.price, order.currency)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 font-medium text-xs">
                                +{order.items.length - 3}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Order Actions */}
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                        {order.status === "FULFILLED" && (
                          <>
                            <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5 text-sm">
                              <FaStar className="w-3.5 h-3.5" />
                              Review
                            </button>
                            <button className="px-3 py-1.5 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm">
                              Buy Again
                            </button>
                          </>
                        )}
                        {(order.status === "CREATED" ||
                          order.status === "PAYMENT_PENDING") && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        )}
                        {order.status === "CANCELLED" && (
                          <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                            Re-order
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Order Details Expandable */}
                    {selectedOrder?._id === order._id && (
                      <div className="border-t border-gray-200">
                        <div className="p-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Order Items */}
                            <div>
                              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-1.5 text-sm">
                                <FaShoppingBag className="w-4 h-4 text-indigo-600" />
                                Order Items
                              </h3>
                              <div className="space-y-3">
                                {order.items?.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                                  >
                                    <div className="flex items-center gap-2">
                                      {item.image ? (
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-10 h-10 object-cover rounded border border-gray-200"
                                        />
                                      ) : (
                                        <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                          <FaBox className="w-4 h-4 text-gray-400" />
                                        </div>
                                      )}
                                      <div>
                                        <h4 className="font-medium text-gray-800 text-sm">
                                          {item.name}
                                        </h4>
                                        <p className="text-xs text-gray-600">
                                          Qty: {item.quantity}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-bold text-gray-800 text-sm">
                                        {formatCurrency(
                                          item.price * item.quantity,
                                          order.currency
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        {formatCurrency(
                                          item.price,
                                          order.currency
                                        )}{" "}
                                        each
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping & Payment */}
                            <div className="space-y-4">
                              {/* Shipping Info */}
                              <div>
                                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-1.5 text-sm">
                                  <FaTruck className="w-4 h-4 text-green-600" />
                                  Shipping
                                </h3>
                                <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                                  {order.shippingAddress && (
                                    <>
                                      <div className="flex items-start gap-2">
                                        <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <p className="font-medium text-gray-800 text-xs">
                                            Delivery Address
                                          </p>
                                          <p className="text-gray-600 text-xs">
                                            {order.shippingAddress.address},{" "}
                                            {order.shippingAddress.city},{" "}
                                            {order.shippingAddress.country}{" "}
                                            {order.shippingAddress.postalCode}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <FaPhone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <p className="font-medium text-gray-800 text-xs">
                                            Phone
                                          </p>
                                          <p className="text-gray-600 text-xs">
                                            {order.shippingAddress.phone}
                                          </p>
                                        </div>
                                      </div>
                                      {order.shippingAddress.email && (
                                        <div className="flex items-start gap-2">
                                          <FaEnvelope className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                          <div>
                                            <p className="font-medium text-gray-800 text-xs">
                                              Email
                                            </p>
                                            <p className="text-gray-600 text-xs">
                                              {order.shippingAddress.email}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Payment Info */}
                              <div>
                                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-1.5 text-sm">
                                  <FaCreditCard className="w-4 h-4 text-blue-600" />
                                  Payment
                                </h3>
                                <div className="p-3 bg-gray-50 rounded-lg space-y-1.5">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 text-xs">
                                      Subtotal
                                    </span>
                                    <span className="font-medium text-xs">
                                      {formatCurrency(
                                        order.subtotal || 0,
                                        order.currency
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 text-xs">
                                      Tax
                                    </span>
                                    <span className="font-medium text-xs">
                                      {formatCurrency(
                                        order.tax || 0,
                                        order.currency
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 text-xs">
                                      Shipping
                                    </span>
                                    <span className="font-medium text-xs">
                                      {formatCurrency(
                                        order.shippingFee || 0,
                                        order.currency
                                      )}
                                    </span>
                                  </div>
                                  <div className="border-t border-gray-200 pt-1.5 mt-1.5">
                                    <div className="flex justify-between font-bold">
                                      <span className="text-sm">Total</span>
                                      <span className="text-sm">
                                        {formatCurrency(
                                          order.totalAmount,
                                          order.currency
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="pt-1.5 border-t border-gray-200">
                                    <div className="flex items-center gap-1.5">
                                      <FaCreditCard className="w-3.5 h-3.5 text-gray-400" />
                                      <span className="text-gray-600 text-xs">
                                        Method: {order.paymentMethod || "M-Pesa"}
                                      </span>
                                    </div>
                                    <div
                                      className={`inline-block mt-1 px-1.5 py-0.5 rounded text-xs ${
                                        paymentStatus === "Paid"
                                          ? "bg-green-100 text-green-800"
                                          : paymentStatus === "Pending"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {paymentStatus}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => handleDownloadInvoice(order._id)}
                              className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-sm"
                            >
                              <FaPrint className="w-3.5 h-3.5" />
                              Print Invoice
                            </button>
                            <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-sm">
                              <FaWhatsapp className="w-3.5 h-3.5" />
                              Support
                            </button>
                            {order.status === "FULFILLED" && (
                              <button className="px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm">
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
              <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <FaBox className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1.5">
                  No orders found
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {searchQuery
                    ? "No orders match your search"
                    : "You haven't placed any orders yet"}
                </p>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="px-5 lg:px-20 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  Need help with your order?
                </h3>
                <p className="text-gray-600 text-sm">
                  Our support team is here to help you 24/7
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5 text-sm">
                  <FaPhone className="w-4 h-4" />
                  Call Support
                </button>
                <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-1.5 text-sm">
                  <FaEnvelope className="w-4 h-4" />
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