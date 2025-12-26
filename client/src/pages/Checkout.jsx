import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import axios from "axios";
import {
  CreditCard,
  Smartphone,
  Wallet,
  Truck,
  ShieldCheck,
  Lock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

export default function Checkout() {
  const { cart, getCartTotal, clearCart, currSymbol, backendUrl } = useCart();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false); // New state to track if order completed

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Show 3 items per page

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    phone: "",
  });

  const [selectedPayment, setSelectedPayment] = useState("stripe");

  // Pagination calculations
  const totalPages = Math.ceil(cart.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = cart.slice(startIndex, endIndex);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = () => {
    // Validate all fields before showing confirmation
    const emptyField = Object.entries(shippingInfo).find(
      ([key, value]) => value.trim() === ""
    );
    if (emptyField) {
      toast.error(
        `Please fill in your ${emptyField[0]
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()}`
      );
      return;
    }

    // Show confirmation dialog
    setShowConfirmationDialog(true);
  };

  const handlePlaceOrder = async () => {
    // Close confirmation dialog
    setShowConfirmationDialog(false);

    try {
      setIsPlacingOrder(true);

      // Create order
      const { data: orderData } = await axios.post(
        `${backendUrl}/api/orders`,
        {
          shippingInfo,
          paymentMethod: selectedPayment,
          items: cart.map((item) => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        { withCredentials: true }
      );

      if (!orderData.success) {
        setIsPlacingOrder(false);
        return toast.error(orderData.message);
      }

      const orderId = orderData.order._id;

      // If payment is M-PESA initiate payment
      if (selectedPayment === "mpesa") {
        const { data: mpesaData } = await axios.post(
          `${backendUrl}/api/mpesa/initiate`,
          {
            orderId,
            phoneNumber: shippingInfo.phone,
          },
          { withCredentials: true }
        );

        if (!mpesaData.success) {
          setIsPlacingOrder(false);
          return toast.error(mpesaData.message || "M-Pesa payment failed");
        }

        const transactionId = mpesaData.transaction._id;

        const pollTransactionStatus = async (transactionId) => {
          try {
            const { data } = await axios.get(
              `${backendUrl}/api/mpesa/${transactionId}`,
              { withCredentials: true }
            );
            return data;
          } catch (error) {
            console.error(error);
            return null;
          }
        };

        let interval = setInterval(async () => {
          const data = await pollTransactionStatus(transactionId);

          if (data?.transaction?.status === "SUCCESS") {
            clearInterval(interval);
            // Don't clear cart yet - just mark order as completed
            setOrderCompleted(true);
            setShowSuccessModal(true);

            // Clear cart and navigate after modal timeout
            setTimeout(() => {
              clearCart();
              setShowSuccessModal(false);
              setIsPlacingOrder(false);
              navigate("/my-orders");
            }, 3000);
          } else if (data?.transaction?.status === "FAILED") {
            clearInterval(interval);
            setIsPlacingOrder(false);

            const reason =
              data?.transaction?.failureReason ||
              "Payment failed. Please try again.";

            toast.error(reason);
          }
        }, 5000);
      } else {
        // For non-M-Pesa payments
        // Mark order as completed and show success modal
        setOrderCompleted(true);
        setShowSuccessModal(true);

        // Clear cart and navigate after modal timeout
        setTimeout(() => {
          clearCart();
          setShowSuccessModal(false);
          setIsPlacingOrder(false);
          navigate("/my-orders");
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      setIsPlacingOrder(false);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const getPaymentMethodName = () => {
    const method = paymentMethods.find((m) => m.id === selectedPayment);
    return method ? method.name : selectedPayment.toUpperCase();
  };

  const totals = getCartTotal();

  const paymentMethods = [
    {
      id: "stripe",
      name: "Credit / Debit Card",
      icon: <CreditCard className="h-5 w-5" />,
      description: "Pay with Visa, Mastercard, or Amex",
      color: "border-blue-500 bg-blue-50 hover:bg-blue-100",
      activeColor: "border-blue-600 bg-blue-100 ring-2 ring-blue-200",
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: (
        <div className="flex items-center gap-1">
          <span className="font-bold text-blue-700">Pay</span>
          <span className="font-bold text-blue-400">Pal</span>
        </div>
      ),
      description: "Secure online payments",
      color: "border-yellow-500 bg-yellow-50 hover:bg-yellow-100",
      activeColor: "border-yellow-600 bg-yellow-100 ring-2 ring-yellow-200",
    },
    {
      id: "mpesa",
      name: "M-Pesa",
      icon: (
        <div className="flex items-center gap-1">
          <Smartphone className="h-5 w-5 text-green-600" />
          <span className="text-xs font-medium text-green-700">M-PESA</span>
        </div>
      ),
      description: "Mobile money payment",
      color: "border-green-500 bg-green-50 hover:bg-green-100",
      activeColor: "border-green-600 bg-green-100 ring-2 ring-green-200",
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: <Wallet className="h-5 w-5" />,
      description: "Pay when you receive",
      color: "border-purple-500 bg-purple-50 hover:bg-purple-100",
      activeColor: "border-purple-600 bg-purple-100 ring-2 ring-purple-200",
    },
  ];

  // Show empty cart page only if cart is empty AND no order was just completed
  if (cart.length === 0 && !orderCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add items to your cart to checkout
          </p>
          <Button onClick={() => navigate("/")} className="px-8">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Checkout
          </h1>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <span className="font-medium">Shipping</span>
            </div>
            <div className="h-1 w-12 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <span className="font-medium">Payment</span>
            </div>
            <div className="h-1 w-12 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold">
                3
              </div>
              <span className="text-gray-500">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Shipping Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <Input
                      placeholder="John Doe"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <Input
                      placeholder="+254 700 000 000"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <Input
                      placeholder="Street address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <Input
                        placeholder="Nairobi"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <Input
                        placeholder="00100"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <Input
                      placeholder="Kenya"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedPayment === method.id
                        ? method.activeColor
                        : method.color
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon Container - Adjusted for M-Pesa */}
                      <div
                        className={`flex items-center justify-center h-10 rounded-lg bg-white ${
                          method.id === "mpesa" ? "px-3" : "w-10"
                        }`}
                      >
                        {method.id === "stripe" ? (
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-sm"></div>
                            <div className="h-2 w-2 bg-gradient-to-r from-red-500 to-red-700 rounded-sm"></div>
                          </div>
                        ) : method.id === "paypal" ? (
                          <div className="flex items-center">
                            <span className="font-bold text-lg text-blue-700">
                              P
                            </span>
                            <span className="font-bold text-lg text-blue-400">
                              P
                            </span>
                          </div>
                        ) : method.id === "mpesa" ? (
                          <div className="flex items-center gap-1">
                            <Smartphone className="h-5 w-5 text-green-600" />
                            <span className="font-bold text-green-700 text-sm">
                              M-PESA
                            </span>
                          </div>
                        ) : (
                          <Wallet className="h-5 w-5 text-purple-600" />
                        )}
                      </div>

                      <div className="text-left flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {method.name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {method.description}
                        </p>
                      </div>

                      <div className="ml-2">
                        <div
                          className={`h-5 w-5 rounded-full border-2 ${
                            selectedPayment === method.id
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedPayment === method.id && (
                            <div className="h-2 w-2 rounded-full bg-white m-auto mt-1.5"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* M-Pesa Specific Instructions */}
              {selectedPayment === "mpesa" && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Smartphone className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-green-800 mb-2">
                        How to pay with M-Pesa
                      </h4>
                      <ol className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="h-6 w-6 rounded-full bg-green-200 text-green-800 flex items-center justify-center text-sm font-medium flex-shrink-0">
                            1
                          </span>
                          <span className="text-green-700">
                            Enter your phone number in the shipping information
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="h-6 w-6 rounded-full bg-green-200 text-green-800 flex items-center justify-center text-sm font-medium flex-shrink-0">
                            2
                          </span>
                          <span className="text-green-700">
                            Click "Place Order" to receive an M-Pesa prompt on
                            your phone
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="h-6 w-6 rounded-full bg-green-200 text-green-800 flex items-center justify-center text-sm font-medium flex-shrink-0">
                            3
                          </span>
                          <span className="text-green-700">
                            Enter your M-Pesa PIN when prompted
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="h-6 w-6 rounded-full bg-green-200 text-green-800 flex items-center justify-center text-sm font-medium flex-shrink-0">
                            4
                          </span>
                          <span className="text-green-700">
                            Wait for confirmation message (usually within 30
                            seconds)
                          </span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary WITH PAGINATION */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Cart Items with Pagination */}
              <div className="space-y-4 mb-6">
                {/* Items Counter */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    Items ({cart.length})
                  </span>
                  {cart.length > itemsPerPage && (
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                  )}
                </div>

                {/* Display current page items */}
                {currentItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="h-16 w-16 bg-gray-200 rounded-lg flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-300 rounded-lg">
                          <span className="text-gray-400 text-xs">IMG</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        {currSymbol} {(item.price || 0).toFixed(2)} each
                      </p>
                    </div>
                    <div className="font-semibold whitespace-nowrap">
                      {currSymbol}{" "}
                      {((item.price || 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}

                {/* Simplified Pagination Controls*/}
                {cart.length > itemsPerPage && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between gap-2">
                      {/* Previous Button - Compact */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-2 py-1 h-8 min-w-[70px] text-sm"
                      >
                        <ChevronLeft className="h-3 w-3" />
                        <span className="truncate">Prev</span>
                      </Button>

                      {/* Compact Page Indicator */}
                      <div className="flex-1 text-center min-w-0 px-2">
                        <div className="text-sm font-medium text-gray-700 truncate">
                          Page {currentPage} of {totalPages}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          Items {startIndex + 1}-
                          {Math.min(endIndex, cart.length)} of {cart.length}
                        </div>
                      </div>

                      {/* Next Button - Compact */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-2 py-1 h-8 min-w-[70px] text-sm"
                      >
                        <span className="truncate">Next</span>
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-b border-gray-200 py-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {currSymbol} {(totals.subtotal || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {totals.shipping === 0
                      ? "Free"
                      : `$${(totals.shipping || 0).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    {currSymbol} {(totals.tax || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">$0.00</span>
                </div>
              </div>

              {/* Total */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {currSymbol} {(totals.total || 0).toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Including all taxes and fees
                </p>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg mb-6">
                  <Lock className="h-4 w-4 text-gray-600" />
                  <ShieldCheck className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    Secure 256-bit SSL encryption
                  </span>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handleConfirmOrder}
                  disabled={isPlacingOrder}
                  className="w-full py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center gap-2"
                >
                  {isPlacingOrder ? (
                    <>
                      <span className="loader h-5 w-5 border-2 border-t-2 border-gray-200 rounded-full animate-spin"></span>
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our Terms of Service and
                  Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmationDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Confirm Your Order
              </h2>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                You are about to place an order using:
              </p>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900">
                  {getPaymentMethodName()}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Total: {currSymbol} {(totals.total || 0).toFixed(2)}
                </div>
              </div>

              {selectedPayment === "mpesa" && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>Note:</strong> You will receive an M-Pesa prompt on{" "}
                    <strong>{shippingInfo.phone}</strong>
                  </p>
                </div>
              )}

              <p className="text-sm text-gray-600 mt-4">
                Are you sure you want to proceed with this payment method?
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowConfirmationDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handlePlaceOrder} className="flex-1">
                Yes, Place Order
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-2xl max-w-sm w-full mx-auto animate-in fade-in zoom-in duration-300">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <ShieldCheck className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              🎉 Order Successful!
            </h2>
            <p className="text-gray-700 mb-4">
              Your order has been confirmed and is being processed.
              {selectedPayment === "mpesa"
                ? " M-Pesa payment was successful."
                : selectedPayment === "stripe"
                ? " Your card payment was successful."
                : selectedPayment === "paypal"
                ? " Your PayPal payment was successful."
                : " Your payment was successful."}
            </p>
            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <p className="text-sm text-gray-600">
                Order Total:{" "}
                <span className="font-bold text-gray-900">
                  {currSymbol} {(totals.total || 0).toFixed(2)}
                </span>
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  clearCart();
                  navigate("/my-orders");
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition w-full"
              >
                View My Orders
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  clearCart();
                  navigate("/");
                }}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition w-full"
              >
                Continue Shopping
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Redirecting to orders in 3 seconds...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
