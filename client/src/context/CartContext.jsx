import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { toast } from "sonner";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  const addToCart = (product) => {
    setItems((prevCart) => {
      // 1. Check if product already exists in cart
      const existingItem = prevCart.find((item) => item.id === product.id);

      // 2. If it exists, increase quantity
      if (existingItem) {
        toast.success(`Updated ${product.name} quantity`);
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      toast.success(`Added ${product.name} to cart`);

      // 3. If it does not exist, add new item
      return [
        ...prevCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = useCallback((productId) => {
    setItems((prev)=> {
      const removeItem = prev.find(item => item.id === productId)
      if(removeItem){
        toast.info(`Removed ${removeItem.name} from cart`)
      }
      return prev.filter((item)=> item.id !== productId)
    })
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
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 0 ? 0 : 0;
  const tax = subtotal * 0.16;
  const total = subtotal + shipping + tax;

  const getCartTotal = () => ({
    subtotal,
    shipping,
    tax,
    total,
  });

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
        totalItems,
        totalPrice: subtotal,
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
