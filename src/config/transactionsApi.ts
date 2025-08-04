import { API_BASE_URL, fetchWithCredentials } from "../config/api";

// Transaction Types - Define the structure of our transaction data
export interface TransactionItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
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
  paymentMethod: "COD" | "Paymongo";
  shippingAddress: string;
  status: "to_pay" | "to_receive" | "in_transit" | "completed" | "cancelled";
  cancellationDeadline?: Date;
  canCancel: boolean;
  cancellationReason?: string;
  cancellationDate?: Date;
  deliveryInfo: {
    assignedDeliveryId?: string;
    pickupPhoto?: string;
    deliveryPhoto?: string;
    pickupValidated: boolean;
    deliveryValidated: boolean;
    estimatedDelivery?: Date;
  };
  statusHistory: Array<{
    status: string;
    timestamp: Date;
    updatedBy: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Request types for creating transactions
export interface CreateTransactionRequest {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  paymentMethod: "COD" | "Paymongo";
  shippingAddress: string;
}

// Request type for cancelling transactions
export interface CancelTransactionRequest {
  cancellationReason: string;
}

// Response types
export interface TransactionResponse {
  success: boolean;
  message: string;
  data: Transaction;
}

export interface TransactionsListResponse {
  success: boolean;
  message: string;
  data: {
    transactions: Transaction[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalTransactions: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

// Parameters for fetching transactions
export interface FetchTransactionsParams {
  status?: string;
  page?: number;
  limit?: number;
}

// CREATE TRANSACTION - Add to cart (goes to "To Pay")
export const createTransaction = async (
  transactionData: CreateTransactionRequest
): Promise<Transaction> => {
  try {
    console.log("Creating transaction:", transactionData);

    const response = await fetchWithCredentials(
      `${API_BASE_URL}/transactions`,
      {
        method: "POST",
        body: JSON.stringify(transactionData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create transaction");
    }

    const result: TransactionResponse = await response.json();
    console.log("Transaction created successfully:", result.data.transactionId);
    return result.data;
  } catch (error) {
    console.error("Create transaction error:", error);
    throw error;
  }
};

// CHECKOUT TRANSACTION - Move from "To Pay" to "To Receive"
export const checkoutTransaction = async (
  transactionId: string
): Promise<Transaction> => {
  try {
    console.log("Checking out transaction:", transactionId);

    const response = await fetchWithCredentials(
      `${API_BASE_URL}/transactions/${transactionId}/checkout`,
      {
        method: "PUT",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to checkout transaction");
    }

    const result: TransactionResponse = await response.json();
    console.log(
      "Transaction checked out successfully:",
      result.data.transactionId
    );
    return result.data;
  } catch (error) {
    console.error("Checkout transaction error:", error);
    throw error;
  }
};

// CANCEL TRANSACTION - Only within 5-minute window with reason
export const cancelTransaction = async (
  transactionId: string,
  cancellationData: CancelTransactionRequest
): Promise<Transaction> => {
  try {
    console.log("Cancelling transaction:", transactionId, cancellationData);

    const response = await fetchWithCredentials(
      `${API_BASE_URL}/transactions/${transactionId}/cancel`,
      {
        method: "PUT",
        body: JSON.stringify(cancellationData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to cancel transaction");
    }

    const result: TransactionResponse = await response.json();
    console.log(
      "Transaction cancelled successfully:",
      result.data.transactionId
    );
    return result.data;
  } catch (error) {
    console.error("Cancel transaction error:", error);
    throw error;
  }
};

// GET USER TRANSACTIONS - For UserPanel display
export const fetchUserTransactions = async (
  params: FetchTransactionsParams = {}
): Promise<TransactionsListResponse["data"]> => {
  try {
    const { status = "all", page = 1, limit = 10 } = params;

    const queryParams = new URLSearchParams({
      status,
      page: page.toString(),
      limit: limit.toString(),
    });

    console.log("Fetching user transactions with params:", params);

    const response = await fetchWithCredentials(
      `${API_BASE_URL}/transactions/user?${queryParams}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch transactions");
    }

    const result: TransactionsListResponse = await response.json();
    console.log(`Fetched ${result.data.transactions.length} transactions`);
    return result.data;
  } catch (error) {
    console.error("Fetch user transactions error:", error);
    throw error;
  }
};

// GET TRANSACTION BY ID - Get specific transaction details
export const getTransactionById = async (
  transactionId: string
): Promise<Transaction> => {
  try {
    console.log("Fetching transaction by ID:", transactionId);

    const response = await fetchWithCredentials(
      `${API_BASE_URL}/transactions/${transactionId}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch transaction");
    }

    const result: TransactionResponse = await response.json();
    console.log("Transaction fetched successfully:", result.data.transactionId);
    return result.data;
  } catch (error) {
    console.error("Get transaction by ID error:", error);
    throw error;
  }
};

// HELPER FUNCTIONS

// Calculate transaction totals (for frontend validation)
export const calculateTransactionTotals = (
  items: Array<{ price: number; quantity: number }>
) => {
  const itemsSubtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const vat = itemsSubtotal * 0.08; // 8% VAT
  const shippingFee = 120; // Static shipping fee
  const totalAmount = itemsSubtotal + vat + shippingFee;

  return {
    itemsSubtotal,
    vat,
    shippingFee,
    totalAmount,
  };
};

// Check if transaction can be cancelled (within 5-minute window)
export const canCancelTransaction = (transaction: Transaction): boolean => {
  if (!transaction.canCancel || transaction.status !== "to_receive") {
    return false;
  }

  if (transaction.cancellationDeadline) {
    return new Date() < new Date(transaction.cancellationDeadline);
  }

  return false;
};

// Get time remaining for cancellation (in milliseconds)
export const getCancellationTimeRemaining = (
  transaction: Transaction
): number => {
  if (!transaction.cancellationDeadline) return 0;

  const now = new Date().getTime();
  const deadline = new Date(transaction.cancellationDeadline).getTime();
  const remaining = deadline - now;

  return Math.max(0, remaining);
};

// Format time remaining for display (e.g., "4:32" for 4 minutes 32 seconds)
export const formatTimeRemaining = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Get status display name for UserPanel tabs
export const getStatusDisplayName = (status: string): string => {
  const statusMap: Record<string, string> = {
    to_pay: "To Pay",
    to_receive: "To Receive",
    in_transit: "In Transit",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return statusMap[status] || status;
};

// Get status counts for UserPanel tabs
export const getStatusCounts = (transactions: Transaction[]) => {
  const counts = {
    all: transactions.length,
    to_pay: 0,
    to_receive: 0,
    in_transit: 0,
    completed: 0,
    cancelled: 0,
  };

  transactions.forEach((transaction) => {
    if (counts.hasOwnProperty(transaction.status)) {
      counts[transaction.status as keyof typeof counts]++;
    }
  });

  return counts;
};
