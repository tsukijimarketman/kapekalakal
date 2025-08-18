import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

//request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

// API configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: `${API_BASE_URL}/auth/signin`,
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    VERIFY: `${API_BASE_URL}/auth/verify`,
    SIGNOUT: `${API_BASE_URL}/auth/signout`,
  },
  USER: {
    PROFILE: `${API_BASE_URL}/user/profile`,
    PROFILE_IMAGE: `${API_BASE_URL}/user/profile-image`,
  },
};

// Default fetch options with credentials
export const fetchWithCredentials = (
  url: string,
  options: RequestInit = {}
) => {
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
};
