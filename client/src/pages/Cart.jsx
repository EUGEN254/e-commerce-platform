import React from "react";
import { ShoppingCart, Trash2, Minus, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();
  const navigate = useNavigate();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-lg p-8 text-center">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added anything yet.
          </p>
          <Button onClick={() => navigate("/shop")} className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={clearCart}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear Cart
          </Button>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT — CART ITEMS (SCROLLABLE) */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl shadow-lg overflow-hidden">
              {/* Scrollable container */}
              <div 
                className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#cbd5e1 transparent'
                }}
              >
                <style>
                  {`
                    .scrollable-cart::-webkit-scrollbar {
                      width: 6px;
                    }
                    .scrollable-cart::-webkit-scrollbar-track {
                      background: transparent;
                      border-radius: 3px;
                    }
                    .scrollable-cart::-webkit-scrollbar-thumb {
                      background: #cbd5e1;
                      border-radius: 3px;
                    }
                    .scrollable-cart::-webkit-scrollbar-thumb:hover {
                      background: #94a3b8;
                    }
                  `}
                </style>
                
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
                        transition: { duration: 0.3 }
                      }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 100
                      }}
                      layout
                      className={cn(
                        "flex items-center p-4 md:p-6 border-b last:border-b-0",
                        "hover:bg-muted/50 transition-colors"
                      )}
                    >
                      {/* Image */}
                      <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) =>
                            (e.target.src = "/placeholder-image.jpg")
                          }
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 ml-4 md:ml-6 min-w-0"> {/* Added min-w-0 for truncation */}
                        <h3 className="font-semibold text-lg md:text-xl truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.category}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold text-lg">
                            ${(item.price || 0).toFixed(2)}
                          </span>
                          {item.originalPrice &&
                            item.originalPrice > item.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${(item.originalPrice || 0).toFixed(2)}
                              </span>
                            )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 ml-4">
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
                      <div className="ml-4 md:ml-6 text-right flex-shrink-0">
                        <p className="font-bold text-lg">
                          ${((item.price || 0) * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive mt-2"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* RIGHT — ORDER SUMMARY (FIXED) */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl shadow-lg p-6 md:p-8 lg:sticky lg:top-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Items ({itemCount})</span>
                  <span>${getCartTotal().subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>
                    {getCartTotal().shipping === 0
                      ? "Free"
                      : `$${getCartTotal().shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>${getCartTotal().tax.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${getCartTotal().total.toFixed(2)}</span>
                </div>
              </div>

              <Button
              type="button"
                className="w-full mt-6 text-lg py-6"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate("/shop")}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}