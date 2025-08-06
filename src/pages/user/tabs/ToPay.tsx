import React, { useState, useMemo, useEffect } from "react";

// --- useDebounce hook ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
import { getCart, removeFromCart } from "../../../services/cartApi";
import { toast } from "react-toastify"; // For user feedback

interface CartItem {
  id: string;
  productName: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  selected: boolean;
}

const ToPay: React.FC = () => {
  // --- State and hooks: always at the top ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // Will fetch real data from backend
  const [searchQuery, setSearchQuery] = useState("");
  // Debounced search value for optimized filtering
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: "Juan Dela Cruz",
    phone: "(+63) 9123456789",
    address: "123 Coffee Street, Pasig City, Metro Manila 1600",
  });
  const shippingFee = 120;

  // --- Fetch cart from backend on mount ---
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCart();
        if (
          response.success &&
          response.data &&
          Array.isArray(response.data.items)
        ) {
          // Transform backend cart items to frontend CartItem[]
          const items = response.data.items.map((item: any) => ({
            id: item._id,
            productId: item.product, // backend product ObjectId
            productName: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            selected: false, // default: not selected
          }));
          setCartItems(items);
        } else {
          setCartItems([]);
        }
      } catch (err: any) {
        setError("Failed to fetch cart. Please try again.");
        toast.error("Failed to fetch cart.");
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []); // Run only on mount

  // --- Memoized filtered cart items ---
  // Use debounced search value for optimized filtering
  const filteredCartItems = useMemo(() => {
    if (!debouncedSearch.trim()) return cartItems;
    return cartItems.filter((item) =>
      item.productName.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [cartItems, debouncedSearch]);

  // --- Cart handlers ---
  const handleQuantityChange = (id: string, change: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleSelectItem = (id: string) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleSelectAll = () => {
    const allSelected = filteredCartItems.every((item) => item.selected);
    setCartItems((items) =>
      items.map((item) => {
        // Only toggle items that are currently visible (filtered)
        const isVisible = filteredCartItems.some(
          (filtered) => filtered.id === item.id
        );
        return isVisible ? { ...item, selected: !allSelected } : item;
      })
    );
  };

  // Remove item from cart (backend + frontend)
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const handleRemoveItem = async (id: string) => {
    setRemovingItemId(id);
    try {
      await removeFromCart(id);
      setCartItems((items) => items.filter((item) => item.id !== id));
      toast.success("Item removed from cart.");
    } catch (error: any) {
      toast.error(error?.message || "Failed to remove item.");
    } finally {
      setRemovingItemId(null);
    }
  };

  // --- Derived values ---
  const selectedItems = cartItems.filter((item) => item.selected);
  const merchandiseSubtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const vatAmount = merchandiseSubtotal * 0.08;
  const totalPayment =
    merchandiseSubtotal +
    vatAmount +
    (selectedItems.length > 0 ? shippingFee : 0);
  const hasSelectedItems = selectedItems.length > 0;

  // --- Main return: render loading, error, empty, or cart UI ---
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f9f6ed] dark:bg-[#59382a]">
        <div className="text-[#996936] dark:text-[#e1d0a7] text-xl">
          Loading your cart...
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f9f6ed] dark:bg-[#59382a]">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }
  if (cartItems.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f9f6ed] dark:bg-[#59382a]">
        <div className="text-center">
          <div className="text-[#996936] dark:text-[#e1d0a7] text-xl">
            Your cart is empty
          </div>
          <div className="text-[#7a4e2e] dark:text-[#d0b274] text-lg mt-2">
            Add some coffee to get started!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f6ed] dark:bg-[#59382a] flex flex-col min-h-0 flex-1">
      {/* Search Bar */}
      <div className="p-4 bg-white dark:bg-[#67412c] border-b border-[#e1d0a7] dark:border-[#7a4e2e] shadow-sm flex-shrink-0">
        <div className="max-w-full">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#996936] dark:text-[#d0b274]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search products in your cart..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#f9f6ed] dark:bg-[#59382a] border border-[#e1d0a7] dark:border-[#7a4e2e] rounded-lg text-[#59382a] dark:text-[#f9f6ed] placeholder-[#996936] dark:placeholder-[#d0b274] focus:outline-none focus:ring-2 focus:ring-[#b28341] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden min-h-0">
        <div className="h-full max-w-full mx-auto p-4">
          <div
            className="h-full grid gap-4"
            style={{
              gridTemplateColumns: hasSelectedItems ? "1fr 400px" : "1fr",
            }}
          >
            {/* Left Side - Cart Items */}
            <div className="flex flex-col h-full space-y-3 min-h-0">
              {/* Header */}
              <div className="bg-white dark:bg-[#67412c] rounded-lg border border-[#e1d0a7] dark:border-[#7a4e2e] p-3 flex-shrink-0">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Unit Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Total Price</div>
                  <div className="col-span-1 text-center">Actions</div>
                </div>
              </div>

              {/* Cart Items Container */}
              <div className="bg-white dark:bg-[#67412c] rounded-lg border border-[#e1d0a7] dark:border-[#7a4e2e] overflow-hidden flex flex-col flex-1 min-h-0">
                {/* Select All */}
                <div className="p-4 border-b border-[#e1d0a7] dark:border-[#7a4e2e] bg-[#f9f6ed] dark:bg-[#59382a] flex-shrink-0">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        filteredCartItems.length > 0 &&
                        filteredCartItems.every((item) => item.selected)
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-[#b28341] bg-white dark:bg-[#67412c] border-[#e1d0a7] dark:border-[#7a4e2e] rounded focus:ring-[#b28341] focus:ring-2"
                    />
                    <span className="text-[#7a4e2e] dark:text-[#e1d0a7] font-medium">
                      Coffee Shop Cart ({filteredCartItems.length}{" "}
                      {searchQuery ? "filtered" : "total"})
                    </span>
                  </label>
                </div>

                {/* Scrollable Items List */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  {filteredCartItems.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="text-[#996936] dark:text-[#d0b274] text-lg">
                        No products found
                      </div>
                      <div className="text-[#7a4e2e] dark:text-[#e1d0a7] text-sm mt-2">
                        Try searching with different keywords
                      </div>
                    </div>
                  ) : (
                    filteredCartItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 border-b border-[#e1d0a7] dark:border-[#7a4e2e] last:border-b-0"
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Product Info */}
                          <div className="col-span-5 flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={item.selected}
                              onChange={() => handleSelectItem(item.id)}
                              className="w-4 h-4 text-[#b28341] bg-white dark:bg-[#67412c] border-[#e1d0a7] dark:border-[#7a4e2e] rounded focus:ring-[#b28341] focus:ring-2"
                            />
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-16 h-16 object-cover rounded-lg border border-[#e1d0a7] dark:border-[#7a4e2e] flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <h3 className="text-[#59382a] dark:text-[#f9f6ed] font-medium text-sm line-clamp-2">
                                {item.productName}
                              </h3>
                            </div>
                          </div>

                          {/* Unit Price */}
                          <div className="col-span-2 text-center">
                            <div className="flex flex-col items-center">
                              {item.originalPrice && (
                                <span className="text-[#996936] dark:text-[#d0b274] text-xs line-through">
                                  ₱{item.originalPrice}
                                </span>
                              )}
                              <span className="text-[#b28341] font-semibold">
                                ₱{item.price}
                              </span>
                            </div>
                          </div>

                          {/* Quantity */}
                          <div className="col-span-2 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.id, -1)
                                }
                                className="w-8 h-8 flex items-center justify-center rounded border border-[#e1d0a7] dark:border-[#7a4e2e] bg-white dark:bg-[#59382a] text-[#7a4e2e] dark:text-[#e1d0a7] hover:bg-[#f9f6ed] dark:hover:bg-[#67412c] transition-colors"
                              >
                                −
                              </button>
                              <span className="text-[#59382a] dark:text-[#f9f6ed] font-medium min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center rounded border border-[#e1d0a7] dark:border-[#7a4e2e] bg-white dark:bg-[#59382a] text-[#7a4e2e] dark:text-[#e1d0a7] hover:bg-[#f9f6ed] dark:hover:bg-[#67412c] transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Total Price */}
                          <div className="col-span-2 text-center">
                            <span className="text-[#b28341] font-bold">
                              ₱{item.price * item.quantity}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="col-span-1 text-center">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="cursor-pointer text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="p-4 bg-[#f9f6ed] dark:bg-[#59382a] flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          filteredCartItems.length > 0 &&
                          filteredCartItems.every((item) => item.selected)
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-[#b28341] bg-white dark:bg-[#67412c] border-[#e1d0a7] dark:border-[#7a4e2e] rounded focus:ring-[#b28341] focus:ring-2"
                      />
                      <span className="text-[#7a4e2e] dark:text-[#e1d0a7] text-sm">
                        Select All ({filteredCartItems.length})
                      </span>
                    </label>
                    <button className="text-[#996936] dark:text-[#d0b274] text-sm hover:text-[#7a4e2e] dark:hover:text-[#e1d0a7] transition-colors">
                      Delete
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[#996936] dark:text-[#d0b274] text-sm">
                        Total ({selectedItems.length} item
                        {selectedItems.length !== 1 ? "s" : ""}):
                      </div>
                      <div className="text-[#b28341] font-bold text-lg">
                        ₱{totalPayment.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Order Summary (Only show when items are selected) */}
            {hasSelectedItems && (
              <div className="flex flex-col h-full space-y-3 min-h-0">
                {/* Delivery Address */}
                <div className="bg-white dark:bg-[#67412c] rounded-lg border border-[#e1d0a7] dark:border-[#7a4e2e] p-4 flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[#7a4e2e] dark:text-[#e1d0a7] font-semibold flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Delivery Address
                    </h3>
                    <button className="text-[#b28341] text-sm font-medium hover:text-[#996936] transition-colors">
                      Change
                    </button>
                  </div>
                  <div className="text-[#59382a] dark:text-[#f9f6ed] text-sm">
                    <div className="font-medium">
                      {deliveryAddress.name} {deliveryAddress.phone}
                    </div>
                    <div className="mt-1 text-[#996936] dark:text-[#d0b274]">
                      {deliveryAddress.address}
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-white dark:bg-[#67412c] rounded-lg border border-[#e1d0a7] dark:border-[#7a4e2e] p-4 flex-shrink-0">
                  <h3 className="text-[#7a4e2e] dark:text-[#e1d0a7] font-semibold mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#996936] dark:text-[#d0b274]">
                        Merchandise Subtotal:
                      </span>
                      <span className="text-[#59382a] dark:text-[#f9f6ed]">
                        ₱{merchandiseSubtotal}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#996936] dark:text-[#d0b274]">
                        VAT (8%):
                      </span>
                      <span className="text-[#59382a] dark:text-[#f9f6ed]">
                        ₱{vatAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#996936] dark:text-[#d0b274]">
                        Shipping Subtotal:
                      </span>
                      <span className="text-[#59382a] dark:text-[#f9f6ed]">
                        ₱{selectedItems.length > 0 ? shippingFee : 0}
                      </span>
                    </div>

                    <div className="border-t border-[#e1d0a7] dark:border-[#7a4e2e] pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[#7a4e2e] dark:text-[#e1d0a7] font-semibold">
                          Total Payment:
                        </span>
                        <span className="text-[#b28341] font-bold text-lg">
                          ₱{totalPayment.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-4 py-3 px-4 bg-[#b28341] hover:bg-[#996936] text-white font-semibold rounded-lg transition-colors duration-200">
                    Place Order
                  </button>
                </div>

                {/* Payment Method */}
                <div className="bg-white dark:bg-[#67412c] rounded-lg border border-[#e1d0a7] dark:border-[#7a4e2e] p-4 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[#7a4e2e] dark:text-[#e1d0a7] font-semibold">
                      Payment Method
                    </h3>
                    <button className="text-[#b28341] text-sm font-medium hover:text-[#996936] transition-colors">
                      CHANGE
                    </button>
                  </div>
                  <div className="mt-2 text-[#59382a] dark:text-[#f9f6ed] text-sm">
                    Cash on Delivery
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToPay;
