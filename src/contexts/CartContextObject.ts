import { createContext } from "react";

type CartContextType = {
  cartCount: number;
  refreshCart: () => Promise<void>;
};

export const CartContext = createContext<CartContextType>({
  cartCount: 0,
  refreshCart: async () => {},
});
