import React from "react";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  X,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Badge } from "../components/ui/badge";
import truncateToThreeWords from "../utils/truncateToThreeWords.js";

export function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal,currSymbol } =
    useCart();
  const navigate = useNavigate();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Mobile-friendly back button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 mb-4 sm:mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Shop</span>
            <span className="sm:hidden">Back</span>
          </Button>

          <div className="bg-card rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-center">
            <ShoppingCart className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6">
              Looks like you haven't added anything yet.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                onClick={() => navigate("/shop")}
                className="gap-2 px-6 sm:px-8"
                size="lg"
              >
                <ShoppingCart className="h-4 w-4" />
                Start Shopping
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="gap-2 px-6 sm:px-8"
                size="lg"
              >
                View Featured Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header - Mobile responsive */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="gap-2 mb-2 sm:mb-0 sm:hidden"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Shopping Cart ({itemCount} items)
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearCart}
            className="gap-2 w-full sm:w-auto"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Clear Cart</span>
            <span className="sm:hidden">Clear All</span>
          </Button>
        </div>

        {/* GRID LAYOUT - Better mobile responsiveness */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
          {/* LEFT — CART ITEMS (SCROLLABLE) */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-card rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
              {/* Scrollable container with better mobile handling */}
              <div
                className="max-h-[calc(100vh-300px)] sm:max-h-[calc(100vh-200px)] overflow-y-auto pr-1 sm:pr-2"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#cbd5e1 transparent",
                }}
              >
                <AnimatePresence>
                  {cart.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        marginBottom: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        transition: { duration: 0.3 },
                      }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 100,
                      }}
                      layout
                      className={cn(
                        "flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 border-b last:border-b-0 gap-4 sm:gap-0",
                        "hover:bg-muted/50 transition-colors"
                      )}
                    >
                      {/* Image and Basic Info - Mobile stacked */}
                      <div className="flex items-start gap-4 w-full sm:w-auto">
                        {/* Image */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0">
                          <img
                            src={item.image || item.mainImage}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) =>
                              (e.target.src = "/placeholder-image.jpg")
                            }
                          />
                        </div>

                        {/* Details - Better mobile text handling */}
                        <div className="flex-1 min-w-0 w-full sm:max-w-[200px] md:max-w-[300px] lg:max-w-[400px] px-2 sm:px-4">
                          {/* Product Name - Max 3 words then truncate */}
                          <h3
                            className="font-semibold text-base sm:text-lg md:text-xl hover:text-primary cursor-pointer mb-1"
                            onClick={() => navigate(`/product/${item.id}`)}
                            title={item.name}
                          >
                            {truncateToThreeWords(item.name)}
                          </h3>

                          {/* Color and Size - Only show if available */}
                          {(item.selectedColor || item.selectedSize) && (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {item.selectedColor && (
                                <Badge variant="outline" className="text-xs">
                                  Color:{" "}
                                  {item.selectedColor.name ||
                                    item.selectedColor.value}
                                </Badge>
                              )}
                              {item.selectedSize && (
                                <Badge variant="outline" className="text-xs">
                                  Size: {item.selectedSize}
                                </Badge>
                              )}
                            </div>
                          )}

                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            {item.category}
                            {item.brand && ` • ${item.brand}`}
                          </p>

                          {/* Price - Mobile layout */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="font-bold text-base sm:text-lg">
                              {currSymbol}{(item.price || 0).toFixed(2)}
                            </span>
                            {item.originalPrice &&
                              item.originalPrice > item.price && (
                                <span className="text-xs sm:text-sm text-muted-foreground line-through">
                                  {currSymbol}{(item.originalPrice || 0).toFixed(2)}
                                </span>
                              )}
                          </div>

                          {/* Mobile-only actions */}
                          <div className="flex items-center justify-between sm:hidden mt-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                                className="h-8 w-8"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-6 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                disabled={
                                  item.stock && item.quantity >= item.stock
                                }
                                className="h-8 w-8"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-destructive text-xs"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Controls - Hidden on mobile */}
                      <div className="hidden sm:flex items-center justify-between w-full sm:w-auto sm:ml-4">
                        {/* View Product Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/product/${item.id}`)}
                          className="gap-1 mr-4"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="hidden md:inline">View</span>
                        </Button>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="flex-shrink-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.stock && item.quantity >= item.stock}
                            className="flex-shrink-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Subtotal & Remove */}
                        <div className="ml-4 md:ml-6 text-right flex-shrink-0 min-w-[100px]">
                          <p className="font-bold text-base md:text-lg">
                            {currSymbol} {((item.price || 0) * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-destructive mt-2"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Remove</span>
                          </Button>
                        </div>
                      </div>

                      {/* Mobile Subtotal - Hidden on desktop */}
                      <div className="sm:hidden w-full pt-3 border-t">
                        <div className="flex justify-between items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/product/${item.id}`)}
                            className="gap-1 text-xs"
                          >
                            <Eye className="h-3 w-3" />
                            View Product Details
                          </Button>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Subtotal:
                            </p>
                            <p className="font-bold">
                              {currSymbol}{((item.price || 0) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* RIGHT — ORDER SUMMARY (FIXED) - Better mobile */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-card rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:sticky lg:top-4">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">
                    Items ({itemCount})
                  </span>
                  <span className="font-medium">
                    {currSymbol}{getCartTotal().subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {getCartTotal().shipping === 0
                      ? "Free"
                      : `${currSymbol} ${getCartTotal().shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">
                    {currSymbol}{getCartTotal().tax.toFixed(2)}
                  </span>
                </div>

                <div className="border-t pt-3 mt-3 flex justify-between font-bold text-base sm:text-lg">
                  <span>Total</span>
                  <span>{currSymbol}{getCartTotal().total.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="mt-4 pt-4 border-t text-xs sm:text-sm text-muted-foreground">
                <p className="flex items-center gap-2 mb-1">
                  <span className="text-green-600">✓</span>
                  Free shipping on orders over $50
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Delivery in 3-5 business days
                </p>
              </div>

              <Button
                type="button"
                className="w-full mt-6 text-base sm:text-lg py-4 sm:py-6"
                onClick={() => navigate("/checkout")}
                size="lg"
              >
                Proceed to Checkout
              </Button>

              {/* Secure Payment Info */}
              <div className="mt-4 text-center text-xs text-muted-foreground">
                <p>Secure SSL Encryption</p>
                <p>100% Secure Payment</p>
              </div>
            </div>

            {/* Continue Shopping Button - Mobile only */}
            <div className="lg:hidden mt-4">
              <Button
                variant="outline"
                onClick={() => navigate("/shop")}
                className="w-full gap-2"
                size="lg"
              >
                <X className="h-4 w-4" />
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>

        {/* Continue Shopping - Desktop only */}
        <div className="hidden lg:block mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate("/shop")}
            className="gap-2"
            size="lg"
          >
            <X className="h-4 w-4" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
