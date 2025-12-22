import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Truck,
  ShieldCheck,
  Lock,
  ArrowLeft
} from "lucide-react";

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = () => {
    const emptyField = Object.entries(shippingInfo).find(
      ([key, value]) => value.trim() === ""
    );
    if (emptyField) {
      toast.error(`Please fill in your ${emptyField[0].replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      return;
    }

    toast.success(
      `Order placed successfully! Payment method: ${selectedPayment.toUpperCase()}`
    );
    clearCart();
    navigate("/order-confirmation");
  };

  const totals = getCartTotal();

  const paymentMethods = [
    {
      id: "stripe",
      name: "Credit / Debit Card",
      icon: <CreditCard className="h-5 w-5" />,
      description: "Pay with Visa, Mastercard, or Amex",
      color: "border-blue-500 bg-blue-50 hover:bg-blue-100",
      activeColor: "border-blue-600 bg-blue-100 ring-2 ring-blue-200"
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
      activeColor: "border-yellow-600 bg-yellow-100 ring-2 ring-yellow-200"
    },
    {
      id: "mpesa",
      name: "M-Pesa",
      icon: (
        <div className="flex items-center gap-1">
          <Smartphone className="h-5 w-5 text-green-600" />
          <span className="tex-xs font-md text-green-700">M-PESA</span>
        </div>
      ),
      description: "Mobile money payment",
      color: "border-green-500 bg-green-50 hover:bg-green-100",
      activeColor: "border-green-600 bg-green-100 ring-2 ring-green-200"
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: <Wallet className="h-5 w-5" />,
      description: "Pay when you receive",
      color: "border-purple-500 bg-purple-50 hover:bg-purple-100",
      activeColor: "border-purple-600 bg-purple-100 ring-2 ring-purple-200"
    }
  ];

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add items to your cart to checkout</p>
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Checkout</h1>
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
                <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
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

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-gray-400 text-xs">IMG</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-b border-gray-200 py-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {totals.shipping === 0 ? "Free" : `$${totals.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">$0.00</span>
                </div>
              </div>
              
              {/* Total */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${totals.total.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Including all taxes and fees
                </p>
                
                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg mb-6">
                  <Lock className="h-4 w-4 text-gray-600" />
                  <ShieldCheck className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Secure 256-bit SSL encryption</span>
                </div>
                
                {/* Place Order Button */}
                <Button
                  onClick={handlePlaceOrder}
                  className="w-full py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  Place Order
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}