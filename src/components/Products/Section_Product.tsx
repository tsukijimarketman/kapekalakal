import React, { useState, useEffect } from "react";
import { FaSearch, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import {
  fetchProducts,
  type FetchProductsParams,
} from "../../services/productsApi";
import { type ProductType, PRODUCT_CATEGORIES } from "./ProductTypes";
import Lottie from "../Lottie";
import ProductModal from "./ProductModal"; // Import the modal component
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Section_Product = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // State for managing products data
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for search and filter functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // State for pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to fetch products from the backend
  const loadProducts = async (params: FetchProductsParams) => {
    try {
      setLoading(true);
      setError(null);

      // Call the API to fetch products with search and filter parameters
      const response = await fetchProducts(params);

      // Update the products state with the fetched data
      setProducts(response.products);

      // Update pagination state
      setPagination(response.pagination);
    } catch (err: any) {
      // Handle any errors that occur during fetching
      setError(err.message || "Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      // Always set loading to false when done
      setLoading(false);
    }
  };

  // useEffect hook to fetch products when component mounts or when search/filter changes
  useEffect(() => {
    // Create parameters object for the API call
    const params: FetchProductsParams = {
      search: searchTerm,
      category: selectedCategory === "all" ? undefined : selectedCategory,
      page: pagination.currentPage,
      limit: 8, // Show 8 products per page
    };

    // Use setTimeout to debounce the search (wait 300ms after user stops typing)
    const timeoutId = setTimeout(() => {
      loadProducts(params);
    }, 300);

    // Cleanup function to clear the timeout if component unmounts or dependencies change
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, pagination.currentPage]); // Dependencies that trigger re-fetch

  // Function to handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page when searching
  };

  // Function to handle category filter changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page when filtering
  };

  // Function to handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  // Function to format price with peso symbol
  const formatPrice = (price: number) => {
    return `₱ ${price.toFixed(2)}`;
  };

  // Function to render star rating (you can make this dynamic later)
  const renderStars = (rating: number = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar
          key={`full-${i}`}
          className="text-yellow-400 text-xs sm:text-sm"
        />
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt
          key="half"
          className="text-yellow-400 text-xs sm:text-sm"
        />
      );
    }

    // Add empty stars to make total 5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaStar
          key={`empty-${i}`}
          className="text-gray-300 text-xs sm:text-sm"
        />
      );
    }

    return stars;
  };

  // Function to handle "Add to Cart" button click
  const handleAddToCart = (product: ProductType, quantity: number = 1) => {
    // TODO: Implement add to cart functionality
    console.log("Adding to cart:", product.name, "Quantity:", quantity);
    if (!user) {
      toast.error("Please log in to add to cart", {
        onClose: () => navigate("/signin"), // Navigate when toast closes
        autoClose: 2000, // Show for 2 seconds
      });
      return;
    }
    // You can add toast notification here later
  };

  // Function to handle product card click
  const handleProductClick = (product: ProductType) => {
    if (!product.isActive || product.stock === 0) return;
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <section className="h-auto w-full flex flex-col">
      {/* Hero Section - Responsive padding and text sizes */}
      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] bg-[#e1d0a7] dark:bg-[#331d15] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="w-full max-w-3xl flex flex-col items-center text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#331d15] dark:text-[#e1d0a7] mb-2 sm:mb-4">
            Our Products
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#67412c] dark:text-[#e1d0a7] max-w-2xl leading-relaxed px-2">
            Discover our carefully curated selection of premium coffee, tea, and
            brewing equipment
          </p>
        </div>
      </div>

      {/* Main Content Section - Responsive padding */}
      <div className="bg-[#efe8d2] dark:bg-[#331d15] flex flex-col px-4 sm:px-6 md:px-12 lg:px-20 py-5 gap-6 md:gap-10">
        {/* Search and Filter Section - Stack on mobile */}
        <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between items-center">
          {/* Search Bar - Full width on mobile */}
          <div className="border border-gray-400 w-full sm:w-[250px] md:w-[300px] h-[40px] rounded-md flex items-center bg-white">
            <div className="w-[50px] flex items-center justify-center text-gray-500">
              <FaSearch />
            </div>
            <input
              type="text"
              placeholder="Search products"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full h-full outline-none bg-transparent px-2 text-gray-700"
            />
          </div>

          {/* Filter Buttons - Responsive layout */}
          <div className="w-full sm:w-auto flex flex-wrap sm:flex-nowrap justify-center sm:justify-end gap-2">
            {/* All Products Filter */}
            <button
              onClick={() => handleCategoryChange("all")}
              className={`cursor-pointer px-2 py-1 sm:px-3 sm:py-2 hover:scale-105 transition-transform flex items-center justify-center gap-1 border border-gray-400 rounded-md text-xs sm:text-sm ${
                selectedCategory === "all"
                  ? "bg-[#986836] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <FiFilter className="text-xs sm:text-sm" />
              <span>All</span>
            </button>

            {/* Category Filters */}
            {PRODUCT_CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`cursor-pointer px-2 py-1 sm:px-3 sm:py-2 hover:scale-105 transition-transform flex items-center justify-center gap-1 border border-gray-400 rounded-md text-xs sm:text-sm ${
                  selectedCategory === category.value
                    ? "bg-[#986836] text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <FiFilter className="text-xs sm:text-sm" />
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Lottie />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-red-500 text-lg mb-4">
                Error loading products
              </p>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => loadProducts({})}
                className="mt-4 px-4 py-2 bg-[#986836] text-white rounded-md hover:bg-[#7a4e2e] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Products Grid - Responsive grid layout */}
        {!loading && !error && (
          <>
            <div className="flex-1 flex items-center justify-center mb-4 md:mb-8">
              {products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg mb-2">
                    No products found
                  </p>
                  <p className="text-gray-500">
                    {searchTerm || selectedCategory !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "No products available at the moment"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 w-full max-w-7xl">
                  {/* Dynamic Product Cards */}
                  {products.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleProductClick(product)}
                      className={`group bg-[#cfb275] dark:bg-[#7a4e2e] h-[350px] sm:h-[380px] md:h-[400px] border border-[#986836] dark:border-[#e1d0a7] rounded-2xl transition-all duration-200 cursor-pointer ${
                        !product.isActive || product.stock === 0
                          ? "opacity-50 grayscale cursor-not-allowed"
                          : "hover:scale-[1.02] hover:shadow-lg"
                      }`}
                    >
                      {product.stock === 0 && (
                        <div
                          className=" absolute inset-0 flex items-center justify-center z-10"
                          style={{
                            background: "rgba(0,0,0,0.5)",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            borderRadius: "1rem",
                            pointerEvents: "none",
                          }}
                        >
                          Out of Stock
                        </div>
                      )}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-[60%] sm:h-[65%] md:h-[70%] w-full object-cover rounded-t-2xl"
                        onError={(e) => {
                          // Fallback image if the product image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://via.placeholder.com/300x200?text=No+Image";
                        }}
                      />
                      <div className="p-3 sm:p-4 h-[40%] sm:h-[35%] md:h-[30%] flex flex-col justify-between">
                        <div>
                          <p className="text-sm sm:text-base md:text-lg font-bold text-[#331d15] dark:text-[#e1d0a7] mb-1 sm:mb-2">
                            {product.name}
                          </p>
                          <div className="flex gap-1 items-center mb-2">
                            {renderStars()}
                            <span className="ml-1 text-xs sm:text-sm text-[#331d15] dark:text-[#e1d0a7]">
                              (4.5)
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-end">
                          <p className="text-lg sm:text-xl font-semibold text-[#331d15] dark:text-[#e1d0a7]">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-2 border border-gray-400 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>

                <span className="px-3 py-2">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-2 border border-gray-400 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </section>
  );
};

export default Section_Product;
