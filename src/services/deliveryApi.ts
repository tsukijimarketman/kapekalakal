// frontend/src/services/deliveryApi.ts
import api from "../config/api";

const deliveryApi = {
  // Get available tasks (matches GET /delivery/available)
  getAvailableTasks: () =>
    api.get("/delivery/available", { withCredentials: true }),

  // Get rider's tasks (matches GET /delivery/my)
  getMyTasks: () => api.get("/delivery/my", { withCredentials: true }),

  // Get rider stats (matches GET /delivery/stats)
  getRiderStats: () => api.get("/delivery/stats", { withCredentials: true }),

  // Accept a task (matches POST /delivery/:id/accept)
  acceptTask: (taskId: string) =>
    api.post(`/delivery/${taskId}/accept`, undefined, {
      withCredentials: true,
    }),

  // Mark pickup complete (matches PUT /delivery/:id/pickup-complete)
  completePickup: (taskId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.put(`/delivery/${taskId}/pickup-complete`, formData, {
      // Let axios set the correct multipart boundary automatically
      withCredentials: true,
    });
  },

  // Mark delivery complete (matches PUT /delivery/:id/delivery-complete)
  completeDelivery: (taskId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.put(`/delivery/${taskId}/delivery-complete`, formData, {
      // Let axios set the correct multipart boundary automatically
      withCredentials: true,
    });
  },

  // Admin: Validate pickup (matches PUT /delivery/:id/validate-pickup)
  validatePickup: (taskId: string) =>
    api.put(`/delivery/${taskId}/validate-pickup`, undefined, {
      withCredentials: true,
    }),

  // Admin: Validate delivery (matches PUT /delivery/:id/validate-delivery)
  validateDelivery: (taskId: string) =>
    api.put(`/delivery/${taskId}/validate-delivery`, undefined, {
      withCredentials: true,
    }),

  // Admin: List all tasks (matches GET /delivery/tasks)
  listAllTasks: (filters = {}) =>
    api.get("/delivery/tasks", { params: filters, withCredentials: true }),
};

export default deliveryApi;
