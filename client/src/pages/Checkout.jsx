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
  MapPin,
  Check,
} from "lucide-react";
import { useShipping } from "../hooks/userShipping";

export default function Checkout() {
  const { cart, getCartTotal, clearCart, currSymbol, backendUrl } = useCart();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const {
    shippingInfo,
    countyData,
    handleShippingInfoChange,
    validateShipping,
    getShippingSuggestions,
  } = useShipping();

  const [selectedPayment, setSelectedPayment] = useState("stripe");
  const [showCountySuggestions, setShowCountySuggestions] = useState(false);
  const [countySuggestions, setCountySuggestions] = useState([]);

  // Calculate totals with shipping based on city/county
  const totals = getCartTotal(shippingInfo.city);

  // Pagination calculations
  const totalPages = Math.ceil(cart.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = cart.slice(startIndex, endIndex);

  // Handle city input with suggestions
  const handleCityChange = (e) => {
    const { name, value } = e.target;
    handleShippingInfoChange(e);

    if (shippingInfo.country.toLowerCase() === "kenya" && value.length >= 2) {
      const suggestions = getShippingSuggestions(value);
      setCountySuggestions(suggestions);
      setShowCountySuggestions(suggestions.length > 0);
    } else {
      setShowCountySuggestions(false);
    }
  };

  // Select a county suggestion
  const selectCountySuggestion = (county) => {
    handleShippingInfoChange({
      target: { name: "city", value: county },
    });
    setShowCountySuggestions(false);
    toast.success(`Selected ${county}`);
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

    // Validate shipping info specifically
    const shippingValidation = validateShipping();
    if (!shippingValidation.valid) {
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

      // Create order with proper totals from cart calculation
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
          // Send calculated totals to backend for validation
          cartTotals: totals,
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
        const idempotencyKey = crypto.randomUUID();
        const { data: mpesaData } = await axios.post(
          `${backendUrl}/api/mpesa/initiate`,
          {
            orderId,
            phoneNumber: shippingInfo.phone,
          },
          {
            withCredentials: true,
            headers: { "Idempotency-Key": idempotencyKey },
          }
        );

        if (!mpesaData.success) {
          setIsPlacingOrder(false);
          return toast.error(mpesaData.message || "M-Pesa payment failed");
        }

        const transactionId = mpesaData.transaction._id;
        const pollStartTime = Date.now();
        const POLL_TIMEOUT_MS = 2 * 60 * 1000; // 3 minutes
        const POLL_INTERVAL_MS = 5000; // 5 seconds

        const pollTransactionStatus = async (transactionId) => {
          try {
            const { data } = await axios.get(
              `${backendUrl}/api/mpesa/${transactionId}`,
              { withCredentials: true }
            );
            return data;
          } catch (error) {
            console.error("Poll error:", error);
            return null;
          }
        };

        let interval = setInterval(async () => {
          const elapsedTime = Date.now() - pollStartTime;

          // Stop polling if timeout reached
          if (elapsedTime > POLL_TIMEOUT_MS) {
            clearInterval(interval);
            setIsPlacingOrder(false);
            toast.error("Payment request timed out. Please try again.");
            return;
          }

          const data = await pollTransactionStatus(transactionId);

          if (data?.transaction?.status === "SUCCESS") {
            clearInterval(interval);
            setOrderCompleted(true);
            setShowSuccessModal(true);

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
          } else if (data?.transaction?.status === "TIMEOUT") {
            clearInterval(interval);
            setIsPlacingOrder(false);
            toast.error(
              "Payment request expired. Please initiate a new payment."
            );
          }
        }, POLL_INTERVAL_MS);
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
                      onChange={handleShippingInfoChange}
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
                      onChange={handleShippingInfoChange}
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
                      onChange={handleShippingInfoChange}
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
                      onChange={handleShippingInfoChange}
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City / County *
                      </label>
                      <div className="relative">
                        <Input
                          placeholder={
                            shippingInfo.country === "Kenya"
                              ? "Nairobi, Mombasa, Kisumu..."
                              : "Enter your city"
                          }
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleCityChange}
                          className="w-full"
                          onFocus={() => {
                            if (
                              shippingInfo.country.toLowerCase() === "kenya" &&
                              shippingInfo.city.length >= 2
                            ) {
                              const suggestions = getShippingSuggestions(
                                shippingInfo.city
                              );
                              setCountySuggestions(suggestions);
                              setShowCountySuggestions(suggestions.length > 0);
                            }
                          }}
                          onBlur={() =>
                            setTimeout(
                              () => setShowCountySuggestions(false),
                              200
                            )
                          }
                        />
                        {countyData && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              <Check className="h-3 w-3" />
                              <span>
                                {countyData.price} {currSymbol}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* County Suggestions Dropdown */}
                      {showCountySuggestions &&
                        countySuggestions.length > 0 && (
                          <div className="absolute z-10 w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
                            <div className="py-1">
                              <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50">
                                Suggested Counties
                              </div>
                              {countySuggestions.map((county) => (
                                <button
                                  key={county}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    selectCountySuggestion(county);
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">
                                      {county}
                                    </span>
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    {countyData?.price || 0} {currSymbol}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                      {shippingInfo.country === "Kenya" &&
                        !countyData &&
                        shippingInfo.city.length > 0 && (
                          <p className="mt-1 text-xs text-gray-500">
                            Enter a Kenyan county for accurate shipping
                            calculation
                          </p>
                        )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <Input
                        placeholder="00100"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleShippingInfoChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingInfoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Kenya">Kenya</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Tanzania">Tanzania</option>
                      <option value="Other">Other International</option>
                    </select>
                  </div>

                  {/* Shipping Cost Preview */}
                  {shippingInfo.city && shippingInfo.country && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-blue-900">
                            Shipping Cost:
                          </span>
                          {countyData && (
                            <p className="text-xs text-blue-700 mt-1">
                              Zone: {countyData.zone}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-blue-900">
                            {totals.shipping === 0
                              ? "FREE"
                              : `${currSymbol} ${(totals.shipping || 0).toFixed(
                                  2
                                )}`}
                          </span>
                          {totals.subtotal >= 5000 && (
                            <p className="text-xs text-green-600 mt-1">
                              Free shipping applied! 🎉
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
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
                            Wait for confirmation message 
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
              <div className="mb-6">
                {/* Items Counter */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">
                    Items ({cart.length})
                  </span>
                  {cart.length > itemsPerPage && (
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                  )}
                </div>

                {/* Display current page items - IMPROVED LAYOUT */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {currentItems.map((item) => {
                    const itemOriginalPrice =
                      Number(item.originalPrice) || Number(item.price) || 0;
                    const itemCurrentPrice = Number(item.price) || 0;
                    const itemSavings =
                      (itemOriginalPrice - itemCurrentPrice) * item.quantity;
                    const hasDiscount = itemSavings > 0;
                    const discountPercentage = hasDiscount
                      ? Math.round(
                          ((itemOriginalPrice - itemCurrentPrice) /
                            itemOriginalPrice) *
                            100
                        )
                      : 0;

                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        {/* Product Image */}
                        <div className="h-20 w-20 bg-gray-200 rounded-lg flex-shrink-0">
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

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          {/* Product Name */}
                          <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                            {item.name}
                          </h4>

                          {/* Variants */}
                          <p className="text-xs text-gray-500 mb-1">
                            {item.selectedColor?.name &&
                              `${item.selectedColor.name}, `}
                            {item.selectedSize}
                          </p>

                          {/* Quantity */}
                          <p className="text-xs text-gray-600 mb-2">
                            Qty: {item.quantity}
                          </p>

                          {/* Pricing - Stacked Layout */}
                          <div className="space-y-1">
                            {hasDiscount ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                    Save {discountPercentage}%
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs line-through text-gray-400">
                                    {currSymbol} {itemOriginalPrice.toFixed(2)}
                                  </span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {currSymbol} {itemCurrentPrice.toFixed(2)}
                                  </span>
                                </div>
                                <p className="text-xs text-green-600">
                                  Save {currSymbol}{" "}
                                  {(
                                    itemOriginalPrice - itemCurrentPrice
                                  ).toFixed(2)}{" "}
                                  each
                                </p>
                              </>
                            ) : (
                              <span className="text-sm font-medium text-gray-900">
                                {currSymbol} {itemCurrentPrice.toFixed(2)} each
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Item Total - Right Aligned */}
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {currSymbol}{" "}
                            {((item.price || 0) * item.quantity).toFixed(2)}
                          </div>
                          {hasDiscount && (
                            <p className="text-xs text-green-600 mt-1">
                              Saved {currSymbol} {itemSavings.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Simplified Pagination Controls */}
                {cart.length > itemsPerPage && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between gap-2">
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

                      <div className="flex-1 text-center min-w-0 px-2">
                        <div className="text-sm font-medium text-gray-700 truncate">
                          Page {currentPage} of {totalPages}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          Items {startIndex + 1}-
                          {Math.min(endIndex, cart.length)} of {cart.length}
                        </div>
                      </div>

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

              {/* Price Breakdown - IMPROVED LAYOUT */}
              <div className="border-t border-b border-gray-200 py-6">
                <h3 className="font-medium text-gray-900 mb-4">
                  Price Breakdown
                </h3>

                <div className="space-y-3">
                  {/* Original Price */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Original Price
                    </span>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {currSymbol} {(totals.originalSubtotal || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Product Discounts */}
                  {totals.productDiscounts > 0 && (
                    <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-green-800">
                          Product Discounts
                        </span>
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                          You saved!
                        </span>
                      </div>
                      <span className="text-sm font-bold text-green-700">
                        -{currSymbol}{" "}
                        {(totals.productDiscounts || 0).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Subtotal after discounts */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-gray-700 font-medium">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {currSymbol} {(totals.subtotal || 0).toFixed(2)}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {totals.shipping === 0 ? (
                        <span className="text-green-600 font-medium">FREE</span>
                      ) : (
                        <span>
                          {currSymbol} {(totals.shipping || 0).toFixed(2)}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Tax */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tax (16%)</span>
                    <span className="font-medium text-gray-900">
                      {currSymbol} {(totals.tax || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total - IMPROVED LAYOUT */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    {totals.productDiscounts > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        You saved {currSymbol}{" "}
                        {(totals.productDiscounts || 0).toFixed(2)}!
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">
                      {currSymbol} {(totals.total || 0).toFixed(2)}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Including all taxes and fees
                    </p>
                  </div>
                </div>

                {/* Savings Summary */}
                {totals.productDiscounts > 0 && (
                  <div className="mb-6 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-700 font-bold">✓</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            Great Savings!
                          </p>
                          <p className="text-xs text-green-600">
                            You saved{" "}
                            {Math.round(
                              (totals.productDiscounts /
                                totals.originalSubtotal) *
                                100
                            )}
                            % on products
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-green-700">
                        {currSymbol} {(totals.productDiscounts || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

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
                    <>
                      Place Order • {currSymbol}{" "}
                      {(totals.total || 0).toFixed(2)}
                    </>
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

              {countyData && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">
                      Shipping to {countyData.county}
                    </span>
                    <span className="text-sm font-medium text-blue-900">
                      {totals.shipping === 0
                        ? "FREE"
                        : `${currSymbol} ${countyData.price}`}
                    </span>
                  </div>
                </div>
              )}

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
