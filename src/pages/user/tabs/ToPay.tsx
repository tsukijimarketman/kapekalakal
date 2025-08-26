import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// Components
import DeliveryAddressModal from "./modal/DeliveryAddressModal";
import PaymentMethodModal from "./modal/PaymentMethodModal";

// Services
import { getProfile } from "../../../services/usersApi";
import { getCart, removeFromCart } from "../../../services/cartApi";

// Types
interface CartItem {
  id: string;
  productName: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  selected: boolean;
}

// Custom Hook for debouncing
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

const ToPay: React.FC = () => {
  const navigate = useNavigate();

  // ========== STATE DECLARATIONS ==========
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  // Cart and search states
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Payment and delivery states
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showPaymentModal, setShowPaymentModal] = useState(false); // Added missing state
  const [deliveryAddress, setDeliveryAddress] = useState<{
    name: string;
    phone: string;
    address: string;
    latitude?: number;
    longitude?: number;
  }>({
    name: "",
    phone: "",
    address: "",
    latitude: undefined,
    longitude: undefined,
  });

  // Modal states
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Constants
  const shippingFee = 120;

  // ========== COMPUTED VALUES ==========
  const filteredCartItems = useMemo(() => {
    if (!debouncedSearch.trim()) return cartItems;
    return cartItems.filter((item) =>
      item.productName.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [cartItems, debouncedSearch]);

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

  // Calculate total for PaymentMethodModal
  const grandTotal = totalPayment;

  // ========== EFFECTS ==========
  // Fetch user profile for delivery address
  useEffect(() => {
    async function fetchAddress() {
      try {
        const user = await getProfile();
        setDeliveryAddress({
          name: `${user.firstName} ${user.lastName}`,
          phone: user.contactNumber || "",
          address: user.address || "",
          latitude: user.latitude || undefined,
          longitude: user.longitude || undefined,
        });
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    }
    fetchAddress();
  }, []);

  // Fetch cart from backend
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
          const items = response.data.items.map((item: any) => ({
            id: item._id,
            productId: item.product,
            productName: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            selected: false,
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
  }, []);

  // ========== EVENT HANDLERS ==========
  // Cart item handlers
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
        const isVisible = filteredCartItems.some(
          (filtered) => filtered.id === item.id
        );
        return isVisible ? { ...item, selected: !allSelected } : item;
      })
    );
  };

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

  // Address handlers
  const handleAddressChange = () => {
    setIsAddressModalOpen(true);
  };

  const handleAddressSave = (newAddress: {
    name: string;
    phone: string;
    address: string;
    latitude?: number;
    longitude?: number;
  }) => {
    setDeliveryAddress(newAddress);
    setIsAddressModalOpen(false);
  };

  const handleAddressModalClose = () => {
    setIsAddressModalOpen(false);
  };

  // Payment method handlers
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    if (method === "card") {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentMethodSave = (newPaymentMethod: string) => {
    setPaymentMethod(newPaymentMethod);
    setShowPaymentModal(false);
  };

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
  };

  // Handle successful card payment
  const handleCardPaymentSuccess = async (paymentData: any) => {
    try {
      // Ensure shipping address is present
      if (!deliveryAddress?.address || !deliveryAddress.address.trim()) {
        toast.error("Delivery address is required before completing payment.");
        return;
      }

      const itemsPayload = selectedItems.map((it: any) => ({
        productId: it.productId || it._id,
        quantity: it.quantity,
      }));

      const orderData = {
        items: itemsPayload,
        paymentMethod: "Stripe",
        paymentIntentId: paymentData.paymentIntentId,
        shippingAddress: deliveryAddress.address.trim(),
        latitude: deliveryAddress.latitude,
        longitude: deliveryAddress.longitude,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/transactions/paid`,
        orderData,
        { withCredentials: true }
      );
      toast.success("Order placed successfully!");
      navigate("/payment-success");
    } catch (error: any) {
      console.error("Error placing order:", error?.response?.data || error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    }
  };

  // Initiate PayMongo redirect for GCash / GrabPay
  const initiatePaymongoRedirect = async (type: "gcash" | "grab_pay") => {
    try {
      const itemsPayload = selectedItems.map((it: any) => ({
        productId: it.productId || it._id,
        quantity: it.quantity,
      }));

      // Create Source on backend (PayMongo expects amount in centavos)
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment/source`,
        {
          amount: Math.round(grandTotal * 100),
          currency: "PHP",
          type, // "gcash" | "grab_pay"
          redirectUrl: `${window.location.origin}/payment-success`,
        },
        { withCredentials: true }
      );

      const source = data?.data;
      const sourceId = source?.id;
      const checkoutUrl = source?.attributes?.redirect?.checkout_url;
      if (!sourceId || !checkoutUrl) {
        throw new Error("Failed to initialize payment source");
      }

      // Stash payload for confirmation on success page
      const checkoutPayload = {
        provider: type,
        sourceId,
        items: itemsPayload,
        shippingAddress: deliveryAddress?.address || "",
        latitude: deliveryAddress?.latitude || 0,
        longitude: deliveryAddress?.longitude || 0,
      };
      localStorage.setItem("checkoutPayload", JSON.stringify(checkoutPayload));

      // Redirect to PayMongo hosted page
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error("PayMongo init error:", err);
      toast.error(err?.message || "Failed to initiate payment");
    }
  };

  // Place order handler
  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (deliveryAddress.latitude == null || deliveryAddress.longitude == null) {
      toast.error("Please pin your delivery location on the map");
      return;
    }
    if (!deliveryAddress.address) {
      toast.error("Please provide a delivery address");
      return;
    }
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item to order");
      return;
    }

    // For COD, directly place the order
    if (paymentMethod === "cod") {
      setIsPlacingOrder(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/payment/create-cod`,
          {
            selectedItems: selectedItems.map((item) => ({
              ...item,
              productId: item.productId?._id || item.productId, // Ensure we're sending just the ID
            })),
            deliveryAddress: {
              ...deliveryAddress,
              phone: deliveryAddress.phone || "", // Ensure phone is always a string
            },
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          toast.success("Order placed successfully! (Cash on Delivery)");
          navigate("/payment-success");
        } else {
          throw new Error(response.data.message || "Failed to place order");
        }
      } catch (error: any) {
        console.error("COD order error:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to place order. Please try again."
        );
      } finally {
        setIsPlacingOrder(false);
      }
      return;
    }

    // For other payment methods, use existing flows
    if (paymentMethod === "gcash") {
      await initiatePaymongoRedirect("gcash");
    } else if (paymentMethod === "grab_pay") {
      await initiatePaymongoRedirect("grab_pay");
    } else if (paymentMethod === "card") {
      setShowPaymentModal(true);
    }
  };

  // ========== UTILITY FUNCTIONS ==========
  const getPaymentMethodDisplayName = (method: string) => {
    switch (method) {
      case "gcash":
        return "GCash";
      case "grab_pay":
        return "GrabPay";
      case "card":
        return "Credit/Debit Card";
      case "cod":
      default:
        return "Cash on Delivery";
    }
  };

  // ========== RENDER CONDITIONS ==========
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

  // ========== MAIN RENDER ==========
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
                              disabled={removingItemId === item.id}
                              className="cursor-pointer text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors disabled:opacity-50"
                            >
                              {removingItemId === item.id ? "..." : "Delete"}
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

            {/* Right Side - Order Summary */}
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
                    <button
                      onClick={handleAddressChange}
                      className="cursor-pointer text-[#b28341] text-sm font-medium hover:text-[#996936] transition-colors"
                    >
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

                {/* Payment Method */}
                <div className="bg-white dark:bg-[#67412c] rounded-lg border border-[#e1d0a7] dark:border-[#7a4e2e] p-4 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[#7a4e2e] dark:text-[#e1d0a7] font-semibold">
                      Payment Method
                    </h3>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="text-[#b28341] text-sm font-medium hover:text-[#996936] transition-colors"
                    >
                      CHANGE
                    </button>
                  </div>
                  <div className="mt-2 text-[#59382a] dark:text-[#f9f6ed] text-sm">
                    {getPaymentMethodDisplayName(paymentMethod)}
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
                        ₱{merchandiseSubtotal.toFixed(2)}
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

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="cursor-pointer w-full mt-4 py-3 px-4 bg-[#b28341] hover:bg-[#996936] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    {isPlacingOrder ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========== MODALS ========== */}
      <DeliveryAddressModal
        isOpen={isAddressModalOpen}
        onClose={handleAddressModalClose}
        currentAddress={deliveryAddress}
        onSave={handleAddressSave}
      />

      <PaymentMethodModal
        isOpen={showPaymentModal}
        onClose={handlePaymentModalClose}
        currentPaymentMethod={paymentMethod}
        onSave={handlePaymentMethodChange}
        totalAmount={grandTotal}
        onSuccess={handleCardPaymentSuccess}
      />
    </div>
  );
};

export default ToPay;
