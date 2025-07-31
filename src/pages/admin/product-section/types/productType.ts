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
