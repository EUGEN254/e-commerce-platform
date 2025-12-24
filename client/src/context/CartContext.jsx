import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { toast } from "sonner";
import { useUser } from "./UserContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useUser();

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

    // First, validate and sanitize the product data
    const validatedProduct = {
      ...product,
      id: product.id,
      cartItemId,
      price: Number(product.price) || 0,
      originalPrice:
        Number(product.originalPrice) || Number(product.price) || 0,
      quantity: quantity,
      selectedColor: selectedColor ||
        product.colors?.[0] || {
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
  const getCartTotal = () => {
    // Ensure we only count items with valid prices
    const validItems = items.filter(
      (item) =>
        !isNaN(item.price) && item.price !== undefined && item.price !== null
    );

    const totalItems = validItems.reduce((s, i) => s + i.quantity, 0);
    const subtotal = validItems.reduce(
      (s, i) => s + (Number(i.price) || 0) * i.quantity,
      0
    );
    const shipping = subtotal > 0 ? 0 : 0;
    const tax = subtotal * 0.16;
    const total = subtotal + shipping + tax;

    return {
      totalItems,
      subtotal,
      shipping,
      tax,
      total,
    };
  };

  // Calculate total items for convenience
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate subtotal for convenience
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
    0
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
