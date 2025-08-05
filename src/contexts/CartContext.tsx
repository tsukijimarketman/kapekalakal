import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Transaction {
  _id: string;
  items: CartItem[];
  status: string;
  // ...other fields as needed
}

interface CartContextType {
  toPayCount: number;
  toPayTransactions: Transaction[];
  refreshCart: () => void;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [toPayTransactions, setToPayTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchToPayTransactions = async () => {
    if (!user) {
      setToPayTransactions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get("/api/transactions/user?status=to_pay");
      setToPayTransactions(res.data.data.transactions || []);
    } catch (err) {
      setToPayTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToPayTransactions();
    // Optionally, add polling or subscribe to events for real-time updates
  }, [user]);

  const refreshCart = fetchToPayTransactions;
  const toPayCount = toPayTransactions.reduce(
    (sum, t) => sum + (t.items?.length || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{ toPayCount, toPayTransactions, refreshCart, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};
