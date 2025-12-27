import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { toast } from "sonner";
import { useUser } from "./UserContext";
import { calculateShipping } from "../utils/shippingUtils.js";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useUser();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const currSymbol = "KES";
  const [items, setItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  const addToCart = (product) => {
    // Extract selected options from the product
    const { selectedColor, selectedSize, quantity = 1 } = product;

    // Create a unique cart ID that includes color and size
    const cartItemId = `${product.id}-${selectedColor?.value || "default"}-${
      selectedSize || "default"
    }`;

    // First, validate and sanitize the product data and compute discount
    const rawPrice = Number(product.price) || 0;
    const rawOriginal =
      product.originalPrice !== undefined && product.originalPrice !== null
        ? Number(product.originalPrice)
        : rawPrice;
    const rawDiscount =
      product.discount !== undefined && product.discount !== null
        ? Number(product.discount)
        : 0;

    let computedOriginalPrice = rawOriginal || rawPrice;
    let computedPrice = rawPrice;
    let discountPercent = Math.max(0, Math.min(100, rawDiscount || 0));

    // If a discount percentage is provided, derive the current price from original
    if (discountPercent > 0) {
      // Ensure we have an original price to base the discount on
      if (!computedOriginalPrice || computedOriginalPrice === 0) {
        computedOriginalPrice = rawPrice;
      }
      computedPrice = Number(
        (computedOriginalPrice * (1 - discountPercent / 100)).toFixed(2)
      );
    } else if (computedOriginalPrice > computedPrice) {
      // If originalPrice > price but no explicit discount, infer discount percent
      discountPercent = Math.round(
        ((computedOriginalPrice - computedPrice) / computedOriginalPrice) * 100
      );
    }

    const validatedProduct = {
      ...product,
      id: product.id,
      cartItemId,
      // Store computed values so cart calculations are consistent
      price: computedPrice,
      originalPrice: computedOriginalPrice,
      discount: discountPercent,
      quantity: quantity,
      selectedColor:
        selectedColor || product.colors?.[0] || {
          value: "default",
          name: "Default",
          hex: "#000000",
        },
      selectedSize: selectedSize || product.sizes?.[0] || "M",
    };

    setItems((prevCart) => {
      // Check if product with same ID, color, and size already exists in cart
      const existingItem = prevCart.find(
        (item) => item.cartItemId === cartItemId
      );

      // If it exists, increase quantity
      if (existingItem) {
        const newQuantity = existingItem.quantity + validatedProduct.quantity;
        toast.success(
          `Updated ${validatedProduct.name} (${validatedProduct.selectedColor.name}, ${validatedProduct.selectedSize}) quantity to ${newQuantity}`
        );

        return prevCart.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      toast.success(
        `Added ${validatedProduct.name} (${validatedProduct.selectedColor.name}, ${validatedProduct.selectedSize}) to cart`
      );

      // If it does not exist, add new item
      return [...prevCart, validatedProduct];
    });
  };

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => {
      const removeItem = prev.find((item) => item.id === productId);
      if (removeItem) {
        toast.info(`Removed ${removeItem.name} from cart`);
      }
      return prev.filter((item) => item.id !== productId);
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    toast.info("Cart cleared");
  }, []);

  // order summary calculations
  const getCartTotal = (county = "") => {
    // Ensure we only count items with valid prices
    const validItems = items.filter(
      (item) =>
        !isNaN(item.price) &&
        item.price !== undefined &&
        item.price !== null &&
        Number(item.price) >= 0 &&
        Number(item.quantity) > 0
    );

    const totalItems = validItems.reduce((s, i) => s + i.quantity, 0);

    // Calculate original subtotal (before any discounts)
    const originalSubtotal = validItems.reduce(
      (s, i) =>
        s + (Number(i.originalPrice) || Number(i.price) || 0) * Number(i.quantity),
      0
    );

    // Calculate actual subtotal (after product discounts)
    const subtotal = validItems.reduce(
      (s, i) => s + (Number(i.price) || 0) * Number(i.quantity),
      0
    );

    // Calculate total savings from product discounts
    const productDiscounts = validItems.reduce((s, i) => {
      const itemOriginalPrice = Number(i.originalPrice) || Number(i.price) || 0;
      const itemCurrentPrice = Number(i.price) || 0;
      const itemSavings = (itemOriginalPrice - itemCurrentPrice) * Number(i.quantity);
      return s + Math.max(0, itemSavings); // Ensure savings is not negative
    }, 0);

    // calculate shipping
    const shipping = calculateShipping(subtotal, county);
    // Tax should be rounded to 2 decimals
    const tax = Number((subtotal * 0.16).toFixed(2));
    // Total rounded to 2 decimals
    const total = Number((subtotal + shipping + tax).toFixed(2));

    return {
      totalItems,
      originalSubtotal: Number(originalSubtotal.toFixed(2)), // Total before product discounts
      subtotal: Number(subtotal.toFixed(2)), // Total after product discounts
      productDiscounts: Number(productDiscounts.toFixed(2)), // Total savings from product discounts
      shipping,
      tax,
      total,
      hasProductDiscounts: productDiscounts > 0, // Flag if any product has discount
    };
  };
  // Calculate total items for convenience
  const totalItems = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  // Calculate subtotal for convenience (rounded)
  const subtotal = Number(
    items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0).toFixed(2)
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        cart: items,
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        backendUrl,
        currSymbol,
        totalItems,
        subtotal,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
