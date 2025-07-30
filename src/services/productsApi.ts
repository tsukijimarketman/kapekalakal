import axios from "axios";
import type { ProductType } from "../pages/admin/product-section/types/productType";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface FetchProductsParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface FetchProductsResponse {
  products: ProductType[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export async function fetchProducts(
  params: FetchProductsParams
): Promise<FetchProductsResponse> {
  const response = await axios.get(`${API_BASE}/products`, { params });
  return response.data.data;
}

export async function createProduct(productData: any) {
  const response = await axios.post(`${API_BASE}/products`, productData, {
    withCredentials: true,
  });
  return response.data.data;
}

export async function updateProduct(productId: string, productData: any) {
  const response = await axios.put(
    `${API_BASE}/products/${productId}`,
    productData,
    { withCredentials: true }
  );
  return response.data.data;
}

export async function deleteProduct(productId: string) {
  const response = await axios.delete(`${API_BASE}/products/${productId}`, {
    withCredentials: true,
  });
  return response.data.data;
}
