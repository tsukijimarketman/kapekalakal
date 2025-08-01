// API configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

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
