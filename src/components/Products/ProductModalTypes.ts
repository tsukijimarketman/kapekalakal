import type { ProductType } from "./ProductTypes";

export interface ProductModalProps {
  product: ProductType;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: ProductType, quantity: number) => void;
}

export interface CartItem {
  product: ProductType;
  quantity: number;
  totalPrice: number;
}

export interface QuantityControlProps {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (newQuantity: number) => void;
}
