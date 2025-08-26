import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaCoffee,
  FaLeaf,
  FaCog,
  FaGem,
  FaEye,
} from "react-icons/fa";
import {
  type ProductType,
  type ProductFormData,
  PRODUCT_CATEGORIES,
} from "./types/productType";
import ProductForm from "./ProductForm";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct as deleteProductApi,
} from "../../../services/productsApi";
import { toast } from "react-toastify";
import Lottie from "../../../components/Lottie";

const ProductsManagement: React.FC = () => {
  // State for products from backend (now used)
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Add state for action loading
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    setLoading(true);
    setError(null);
    const handler = setTimeout(() => {
      fetchProducts({
        search: searchTerm,
        category: selectedCategory,
        page: pagination.currentPage,
        limit: 9,
      })
        .then((data) => {
          setProducts(data.products);
          setPagination(data.pagination);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || "Failed to fetch products");
          setLoading(false);
        });
    }, 400); // 400ms debounce
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, pagination.currentPage]);

  // Category icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "coffee":
        return <FaCoffee />;
      case "tea":
        return <FaLeaf />;
      case "equipment":
        return <FaCog />;
      case "accessories":
        return <FaGem />;
      default:
        return <FaEye />;
    }
  };

  const handleCreateProduct = () => {
    setFormMode("create");
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: ProductType) => {
    setFormMode("edit");
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await deleteProductApi(productId); // No token needed if using cookies
      setDeleteConfirm(null);
      toast.success("Product deleted successfully!");
      // Refetch products after delete
      fetchProducts({
        search: searchTerm,
        category: selectedCategory,
        page: pagination.currentPage,
        limit: 9,
      }).then((data) => {
        setProducts(data.products);
        setPagination(data.pagination);
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete product";
      setActionError(message);
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFormSubmit = async (formData: ProductFormData) => {
    setActionLoading(true);
    setActionError(null);
    try {
      if (formMode === "create") {
        await createProduct(formData); // No token needed if using cookies
        toast.success("Product created successfully!");
      } else if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
        toast.success("Product updated successfully!");
      }
      setIsFormOpen(false);
      // Refetch products after create/update
      fetchProducts({
        search: searchTerm,
        category: selectedCategory,
        page: pagination.currentPage,
        limit: 9,
      }).then((data) => {
        setProducts(data.products);
        setPagination(data.pagination);
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save product";
      setActionError(message);
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₱${price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
            Products Management
          </h2>
          <p className="text-[#996936] dark:text-[#d0b274]">
            Manage your coffee shop products, categories, and pricing
          </p>
        </div>
        <button
          onClick={handleCreateProduct}
          className="cursor-pointer mt-4 sm:mt-0 px-4 py-2 bg-[#b28341] text-[#f9f6ed] rounded-lg hover:bg-[#996936] transition-colors duration-200 font-medium flex items-center gap-2 transform hover:scale-105"
        >
          <FaPlus size={16} />
          Add Product
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-[#efe8d2] dark:bg-[#67412c] rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#996936] dark:text-[#d0b274]"
              size={16}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination((prev) => ({ ...prev, currentPage: 1 }));
              }}
              className="w-full pl-10 pr-4 py-2 border border-[#e1d0a7] dark:border-[#7a4e2e] rounded-lg bg-[#f9f6ed] dark:bg-[#59382a] text-[#59382a] dark:text-[#f9f6ed] placeholder-[#996936] dark:placeholder-[#d0b274] focus:outline-none focus:ring-2 focus:ring-[#b28341] transition-colors duration-200"
            />
          </div>

          {/* Category Filter */}
          <div className="sm:w-48 relative">
            <FaFilter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#996936] dark:text-[#d0b274]"
              size={16}
            />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPagination((prev) => ({ ...prev, currentPage: 1 }));
              }}
              className="cursor-pointer w-full pl-10 pr-4 py-2 border border-[#e1d0a7] dark:border-[#7a4e2e] rounded-lg bg-[#f9f6ed] dark:bg-[#59382a] text-[#59382a] dark:text-[#f9f6ed] focus:outline-none focus:ring-2 focus:ring-[#b28341] transition-colors duration-200"
            >
              <option value="all">All Categories</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 text-sm text-[#996936] dark:text-[#d0b274]">
          {loading ? (
            "Loading..."
          ) : error ? (
            <span className="text-red-600 dark:text-red-400">{error}</span>
          ) : (
            <>
              Showing {products.length} of {pagination.totalProducts} products
            </>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="bg-[#efe8d2] dark:bg-[#67412c] rounded-lg p-8 text-center ">
          <div className="text-[#996936] dark:text-[#d0b274] mb-4 h-[40vh]">
            <Lottie />
          </div>
        </div>
      ) : error ? (
        <div className="bg-[#efe8d2] dark:bg-[#67412c] rounded-lg p-8 text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <FaSearch size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">{error}</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#efe8d2] dark:bg-[#67412c] rounded-lg p-8 text-center">
          <div className="text-[#996936] dark:text-[#d0b274] mb-4">
            <FaSearch size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className={`bg-[#efe8d2] dark:bg-[#67412c] rounded-lg overflow-hidden border border-[#e1d0a7] dark:border-[#7a4e2e] hover:shadow-lg transition-all duration-200 transform hover:scale-105
                  ${
                    !product.isActive || product.stock === 0
                      ? "opacity-50 grayscale"
                      : ""
                  }`}
                style={{ position: "relative" }}
              >
                {/* Product Image & Content (disable pointer events if inactive/out-of-stock) */}
                <div
                  className={`${
                    !product.isActive || product.stock === 0
                      ? "pointer-events-none"
                      : ""
                  }`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"; // Hide broken images
                      }}
                    />
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="flex items-center gap-1 text-xs px-2 py-1 bg-[#b28341] text-[#f9f6ed] rounded-full font-medium capitalize backdrop-blur-sm">
                        <div className="text-[#f9f6ed]">
                          {getCategoryIcon(product.category)}
                        </div>
                        {product.category}
                      </span>
                    </div>
                    {/* Out of Stock Badge */}
                    {product.stock === 0 && (
                      <span className="absolute bottom-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Product Content */}
                  <div className="p-6">
                    {/* Product Info */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-[#7a4e2e] dark:text-[#e1d0a7] mb-2 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-[#996936] dark:text-[#d0b274] line-clamp-2 mb-3">
                        {product.description}
                      </p>
                      <p className="text-sm text-[#996936] dark:text-[#d0b274] line-clamp-2 mb-3">
                        Stock: {product.stock ?? 0}
                      </p>
                      <div className="text-xl font-bold text-[#b28341]">
                        {product.formattedPrice || formatPrice(product.price)}
                      </div>
                    </div>

                    {/* Product Meta */}
                    <div className="text-xs text-[#996936] dark:text-[#d0b274] border-t border-[#e1d0a7] dark:border-[#7a4e2e] pt-3">
                      <div className="flex justify-between">
                        <span>Created: {formatDate(product.createdAt)}</span>
                        <span>Updated: {formatDate(product.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Action Buttons (always active for admin) */}
                <div className="absolute top-3 right-3 flex gap-2 z-10">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="cursor-pointer p-2 bg-[#b28341] hover:bg-[#996936] text-[#f9f6ed] rounded-lg transition-colors duration-200 backdrop-blur-sm"
                    title="Edit Product"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product._id)}
                    className="cursor-pointer p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 backdrop-blur-sm"
                    title="Delete Product"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                className="px-3 py-1 rounded bg-[#e1d0a7] dark:bg-[#7a4e2e] text-[#7a4e2e] dark:text-[#e1d0a7] font-medium disabled:opacity-50"
                disabled={pagination.currentPage === 1}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage - 1,
                  }))
                }
              >
                Previous
              </button>
              {/* Page Numbers */}
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  className={`px-3 py-1 rounded font-medium border transition-colors duration-200 ${
                    page === pagination.currentPage
                      ? "bg-[#b28341] text-[#f9f6ed] border-[#b28341]"
                      : "bg-transparent text-[#7a4e2e] dark:text-[#e1d0a7] border-[#e1d0a7] dark:border-[#7a4e2e] hover:bg-[#e1d0a7] dark:hover:bg-[#7a4e2e]"
                  }`}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, currentPage: page }))
                  }
                  disabled={page === pagination.currentPage}
                >
                  {page}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded bg-[#e1d0a7] dark:bg-[#7a4e2e] text-[#7a4e2e] dark:text-[#e1d0a7] font-medium disabled:opacity-50"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage + 1,
                  }))
                }
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-80"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-[#f9f6ed] dark:bg-[#59382a] rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold text-[#7a4e2e] dark:text-[#e1d0a7] mb-4">
              Delete Product
            </h3>
            <p className="text-[#996936] dark:text-[#d0b274] mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            {actionError && (
              <p className="text-red-600 dark:text-red-400 mb-2">
                {actionError}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-[#e1d0a7] dark:border-[#7a4e2e] text-[#7a4e2e] dark:text-[#e1d0a7] rounded-lg hover:bg-[#e1d0a7] dark:hover:bg-[#7a4e2e] transition-colors duration-200 font-medium"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                disabled={actionLoading}
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingProduct={editingProduct}
        mode={formMode}
      />
      {actionError && !isFormOpen && (
        <div className="mt-4 text-center text-red-600 dark:text-red-400">
          {actionError}
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
