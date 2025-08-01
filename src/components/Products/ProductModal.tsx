import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaMinus, FaPlus, FaStar, FaStarHalfAlt } from "react-icons/fa";
import type { ProductType } from "./ProductTypes";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface ProductModalProps {
  product: ProductType;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: ProductType, quantity: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  // Reset quantity when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle quantity changes
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleQuantityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 1 && value <= (product.stock || 0)) {
      setQuantity(value);
    } else if (value > (product.stock || 0)) {
      setQuantity(product.stock || 0);
    } else if (value < 1) {
      setQuantity(1);
    }
  };

  // Format price with peso symbol
  const formatPrice = (price: number) => {
    return `₱${price.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Calculate total price
  const totalPrice = product.price * quantity;

  // Handle add to cart
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please log in to add to cart", {
        onClose: () => navigate("/signin"), // Navigate when toast closes
        autoClose: 2000, // Show for 2 seconds
      });
      return;
    }
    onAddToCart(product, quantity);
    onClose();
  };

  // Function to render star rating
  const renderStars = (rating: number = 5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" className="text-yellow-400 text-sm" />
      );
    }

    // Add empty stars to make total 5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaStar key={`empty-${i}`} className="text-gray-300 text-sm" />
      );
    }

    return stars;
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-[#331d15] rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-[#d0b274] dark:border-[#996936]">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b border-[#efe8d2] dark:border-[#59382a]">
          <h2 className="text-xl font-semibold text-[#331d15] dark:text-[#efe8d2]">
            Product Details
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 hover:bg-[#efe8d2] dark:hover:bg-[#59382a] rounded-full transition-colors"
          >
            <IoClose className="text-xl text-[#331d15] dark:text-[#efe8d2]" />
          </button>
        </div>

        {/* Main Content - Horizontal Layout */}
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Product Image */}
          <div className="lg:w-1/2 p-6">
            <div className="aspect-square w-full max-w-md mx-auto">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg border border-[#efe8d2] dark:border-[#59382a]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://via.placeholder.com/400x400?text=No+Image";
                }}
              />
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div className="lg:w-1/2 p-6 flex flex-col">
            {/* Product Title */}
            <h1 className="text-2xl lg:text-3xl font-bold text-[#331d15] dark:text-[#efe8d2] mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">{renderStars()}</div>
              <span className="text-sm text-[#67412c] dark:text-[#e1d0a7]">
                5(1)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Stock Info */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#67412c] dark:text-[#e1d0a7]">
                  Stock Available:
                </span>
                <span
                  className={`text-sm font-medium ${
                    (product.stock || 0) > 10
                      ? "text-green-600 dark:text-green-400"
                      : (product.stock || 0) > 0
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {product.stock || 0} items
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 flex-1">
              <h3 className="font-semibold text-[#331d15] dark:text-[#efe8d2] mb-2">
                Description:
              </h3>
              <p className="text-[#67412c] dark:text-[#e1d0a7] text-sm leading-relaxed">
                {product.description ||
                  "Premium quality product crafted with care for the best coffee experience."}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <span className="text-[#331d15] dark:text-[#efe8d2] font-medium">
                  Quantity:
                </span>

                <div className="flex items-center border border-[#d0b274] dark:border-[#996936] rounded-lg overflow-hidden bg-white dark:bg-[#59382a]">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-[#efe8d2] dark:hover:bg-[#67412c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaMinus className="text-sm text-[#331d15] dark:text-[#efe8d2]" />
                  </button>

                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityInputChange}
                    min="1"
                    max={product.stock || 0}
                    className="w-12 text-center py-2 bg-transparent text-[#331d15] dark:text-[#efe8d2] font-semibold outline-none"
                  />

                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= (product.stock || 0)}
                    className="p-2 hover:bg-[#efe8d2] dark:hover:bg-[#67412c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaPlus className="text-sm text-[#331d15] dark:text-[#efe8d2]" />
                  </button>
                </div>

                {quantity >= (product.stock || 0) &&
                  (product.stock || 0) > 0 && (
                    <span className="text-sm text-orange-600 dark:text-orange-400">
                      Almost sold out, buy now!
                    </span>
                  )}
              </div>
            </div>

            {/* Total Price */}
            <div className="mb-6 p-4 bg-[#efe8d2] dark:bg-[#59382a] rounded-lg border border-[#d0b274] dark:border-[#996936]">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-[#331d15] dark:text-[#efe8d2]">
                  Total Price:
                </span>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={
                !product.stock || product.stock === 0 || !product.isActive
              }
              className="cursor-pointer w-full bg-[#b28341] hover:bg-[#996936] disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors disabled:cursor-not-allowed"
            >
              {!product.stock || product.stock === 0
                ? "Out of Stock"
                : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
