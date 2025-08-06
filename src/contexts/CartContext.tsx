import { useState, useEffect, type ReactNode } from "react";
import { getCart } from "../services/cartApi";
import { CartContext } from "./CartContextObject";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = async () => {
    try {
      const result = await getCart();
      setCartCount(result.data?.itemCount || 0); // Adjust based on backend response
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};
