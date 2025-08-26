import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

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

// Enhanced fetch with credentials and error handling
export const fetchWithCredentials = async (
  url: string,
  options: RequestInit = {}
) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Ensure we don't override user-provided headers
  const headers = {
    ...defaultHeaders,
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers,
    });

    // If unauthorized, clear user and redirect to login
    if (response.status === 401) {
      // You might want to handle this differently based on your auth flow
      if (window.location.pathname !== '/signin') {
        window.location.href = '/signin';
      }
      throw new Error('Unauthorized');
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
