import React, { useState, useEffect } from "react";
import { FaSave, FaTimes, FaPlus, FaEdit } from "react-icons/fa";
import {
  type ProductType,
  type ProductFormData,
  PRODUCT_CATEGORIES,
} from "./types/productType";
import { toast } from "react-toastify";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: ProductFormData) => void;
  editingProduct?: ProductType | null;
  mode: "create" | "edit";
}

const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/decji4gzv/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "unsigned_preset";
const CLOUDINARY_FOLDER = "products";

const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingProduct,
  mode,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    category: "coffee",
    image: "",
  });

  const [errors, setErrors] = useState<Partial<ProductFormData>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editingProduct && mode === "edit") {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price.toString(),
        category: editingProduct.category,
        image: editingProduct.image,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "coffee",
        image: "",
      });
    }
    setErrors({});
  }, [editingProduct, mode, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    if (!formData.image.trim()) {
      newErrors.image = "Product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ProductFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    setUploading(true);
    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formDataCloud.append("folder", CLOUDINARY_FOLDER);
    // Optionally, prepend 'product_' to the filename
    // formDataCloud.append("public_id", `product_${Date.now()}_${file.name}`);
    try {
      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formDataCloud,
      });
      const data = await res.json();
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, image: data.secure_url }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-80" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#f9f6ed] dark:bg-[#59382a] rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e1d0a7] dark:border-[#7a4e2e]">
          <h3 className="text-xl font-bold text-[#7a4e2e] dark:text-[#e1d0a7] flex items-center gap-2">
            {mode === "create" ? <FaPlus size={20} /> : <FaEdit size={20} />}
            {mode === "create" ? "Add New Product" : "Edit Product"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#7a4e2e] dark:text-[#e1d0a7] hover:bg-[#e1d0a7] dark:hover:bg-[#7a4e2e] transition-colors duration-200"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
              Product Image *
            </label>
            <div className="flex items-center gap-4">
              <label
                htmlFor="product-image-upload"
                className="cursor-pointer group"
              >
                <div className="w-20 h-20 rounded-lg border-2 border-dashed flex items-center justify-center bg-[#efe8d2] dark:bg-[#67412c] overflow-hidden group-hover:border-[#b28341] transition-all">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  ) : uploading ? (
                    <span className="text-[#996936] dark:text-[#d0b274] text-xs">
                      Uploading...
                    </span>
                  ) : (
                    <span className="text-[#996936] dark:text-[#d0b274] text-xs">
                      Click to upload
                    </span>
                  )}
                </div>
                <input
                  id="product-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
              {formData.image && (
                <button
                  type="button"
                  className="text-xs text-red-600 dark:text-red-400 hover:underline"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, image: "" }))
                  }
                  disabled={uploading}
                >
                  Remove
                </button>
              )}
            </div>
            {errors.image && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.image}
              </p>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg bg-[#efe8d2] dark:bg-[#67412c] text-[#59382a] dark:text-[#f9f6ed] placeholder-[#996936] dark:placeholder-[#d0b274] focus:outline-none focus:ring-2 transition-colors duration-200 ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#e1d0a7] dark:border-[#7a4e2e] focus:ring-[#b28341]"
              }`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg bg-[#efe8d2] dark:bg-[#67412c] text-[#59382a] dark:text-[#f9f6ed] placeholder-[#996936] dark:placeholder-[#d0b274] focus:outline-none focus:ring-2 transition-colors duration-200 resize-none ${
                errors.description
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#e1d0a7] dark:border-[#7a4e2e] focus:ring-[#b28341]"
              }`}
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
              Price (₱) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-lg bg-[#efe8d2] dark:bg-[#67412c] text-[#59382a] dark:text-[#f9f6ed] placeholder-[#996936] dark:placeholder-[#d0b274] focus:outline-none focus:ring-2 transition-colors duration-200 ${
                errors.price
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#e1d0a7] dark:border-[#7a4e2e] focus:ring-[#b28341]"
              }`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.price}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-[#e1d0a7] dark:border-[#7a4e2e] rounded-lg bg-[#efe8d2] dark:bg-[#67412c] text-[#59382a] dark:text-[#f9f6ed] focus:outline-none focus:ring-2 focus:ring-[#b28341] transition-colors duration-200"
            >
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#e1d0a7] dark:border-[#7a4e2e] text-[#7a4e2e] dark:text-[#e1d0a7] rounded-lg hover:bg-[#e1d0a7] dark:hover:bg-[#7a4e2e] transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#b28341] text-[#f9f6ed] rounded-lg hover:bg-[#996936] transition-colors duration-200 font-medium flex items-center justify-center gap-2"
            >
              <FaSave size={16} />
              {mode === "create" ? "Create Product" : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
