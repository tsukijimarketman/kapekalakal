export interface TransactionItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  image: string;
  _id?: string;
}

export interface StatusHistory {
  status: string;
  timestamp: string;
  updatedBy: string;
  _id: string;
}

export interface DeliveryInfo {
  latitude?: number;
  longitude?: number;
  estimatedDelivery: string;
  pickupPhoto: string;
  deliveryPhoto: string;
  deliveredAt: string | null;
  adminValidatedDeliveryAt: string | null;
  adminValidatedPickupAt: string | null;
  pickupCompletedAt: string | null;
  pickupValidated: boolean;
  deliveryValidated: boolean;
  cancellationDeadline: string;
  canCancel: boolean;
  assignedDeliveryId?: string | null | undefined;
}

export interface Transaction {
  _id: string;
  transactionId: string;
  customerId: string;
  items: TransactionItem[];
  itemsSubtotal: number;
  vat: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentIntentId: string;
  shippingAddress: string;
  status: string;
  deliveryInfo: DeliveryInfo;
  statusHistory: StatusHistory[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Helper type for creating/updating transactions
export interface CreateUpdateTransactionDTO {
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
    image: string;
  }>;
  shippingAddress: string;
  paymentMethod: string;
  totalAmount: number;
  itemsSubtotal: number;
  vat: number;
  shippingFee: number;
  paymentIntentId?: string;
  deliveryInfo?: Partial<DeliveryInfo>;
}

// For API responses
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// For transaction list responses
export interface TransactionListResponse {
  success: boolean;
  data: {
    transactions: Transaction[];
    total: number;
    page: number;
    pages: number;
  };
}

// For search/filter params
export interface TransactionQueryParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
