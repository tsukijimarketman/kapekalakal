// Public-facing product types for the product section
export interface ProductType {
  _id: string; // MongoDB ObjectId
  name: string;
  description: string;
  price: number;
  category: "coffee" | "tea" | "equipment" | "accessories";
  image: string;
  stock?: number; // Optional field from backend
  isActive?: boolean; // Optional field from backend
  createdAt: Date;
  updatedAt: Date;
  formattedPrice?: string; // Virtual field from backend
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: "coffee" | "tea" | "equipment" | "accessories";
  image: string;
  stock: string;
  isActive: boolean;
}

export const PRODUCT_CATEGORIES = [
  { value: "coffee", label: "Coffee" },
  { value: "tea", label: "Tea" },
  { value: "equipment", label: "Equipment" },
  { value: "accessories", label: "Accessories" },
] as const;

// Type for category values
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]["value"];

// API response types
export interface FetchProductsResponse {
  products: ProductType[];
  pagination: PaginationInfo;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// API request parameters
export interface FetchProductsParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}
