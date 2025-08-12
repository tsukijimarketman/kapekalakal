// frontend/src/services/deliveryApi.ts
import api from "../config/api";

const deliveryApi = {
  // Get available tasks (matches GET /delivery/available)
  getAvailableTasks: () => api.get("/delivery/available"),

  // Get rider's tasks (matches GET /delivery/my)
  getMyTasks: () => api.get("/delivery/my"),

  // Accept a task (matches POST /delivery/:id/accept)
  acceptTask: (taskId: string) => api.post(`/delivery/${taskId}/accept`),

  // Mark pickup complete (matches PUT /delivery/:id/pickup-complete)
  completePickup: (taskId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.put(`/delivery/${taskId}/pickup-complete`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Mark delivery complete (matches PUT /delivery/:id/delivery-complete)
  completeDelivery: (taskId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.put(`/delivery/${taskId}/delivery-complete`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Admin: Validate pickup (matches PUT /delivery/:id/validate-pickup)
  validatePickup: (taskId: string) =>
    api.put(`/delivery/${taskId}/validate-pickup`),

  // Admin: Validate delivery (matches PUT /delivery/:id/validate-delivery)
  validateDelivery: (taskId: string) =>
    api.put(`/delivery/${taskId}/validate-delivery`),

  // Admin: List all tasks (matches GET /delivery/tasks)
  listAllTasks: (filters = {}) =>
    api.get("/delivery/tasks", { params: filters }),
};

export default deliveryApi;
