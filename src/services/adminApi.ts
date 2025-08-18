import api from "../config/api";

const adminApi = {
  // Get all transactions with optional filters
  getTransactions: (filters = {}) =>
    api.get("/admin/transactions", { params: filters, withCredentials: true }),

  // Validate pickup photo
  validatePickup: (transactionId: string) =>
    api.put(
      `/admin/transactions/${transactionId}/validate-pickup`,
      {},
      { withCredentials: true }
    ),

  // Validate delivery photo
  validateDelivery: (transactionId: string) =>
    api.put(
      `/admin/transactions/${transactionId}/validate-delivery`,
      {},
      { withCredentials: true }
    ),

  // Get pending validations
  getPendingValidations: () =>
    api.get("/admin/transactions/pending-validations", {
      withCredentials: true,
    }),
};

export default adminApi;
