import axios from "axios";
import type { UserType } from "../pages/admin/user-section/types/userType";
import { API_BASE_URL } from "../config/api";

// Get the API base URL from environment variables or use localhost as fallback
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Interface for fetch users parameters (search, filter, pagination)
export interface FetchUsersParams {
  search?: string; // Search in firstName, lastName, email
  role?: string; // Filter by role (user, admin, delivery, or "all")
  sortBy?: string; // Sort field (firstName, lastName, email, createdAt, etc.)
  sortOrder?: string; // Sort direction ("asc" or "desc")
  page?: number; // Page number for pagination
  limit?: number; // Number of items per page
}

// Interface for the response when fetching users
export interface FetchUsersResponse {
  users: UserType[]; // Array of user objects
  pagination: {
    // Pagination information
    currentPage: number; // Current page number
    totalPages: number; // Total number of pages
    totalUsers: number; // Total number of users
    hasNextPage: boolean; // Whether there's a next page
    hasPrevPage: boolean; // Whether there's a previous page
  };
}

// Interface for creating/updating user data
export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional for updates
  role: string;
  age?: number;
  sex?: string;
  address?: string;
  contactNumber?: string;
  profileImage?: string;
}

// /**
//  * Fetch users from the backend with search, filtering, and pagination
//  * @param params - Search, filter, and pagination parameters
//  * @returns Promise with users array and pagination info
//  */
export async function fetchUsers(
  params: FetchUsersParams
): Promise<FetchUsersResponse> {
  try {
    // Make GET request to /api/admin/users with query parameters
    // Note: Using admin endpoint instead of regular users endpoint
    const response = await axios.get(`${API_BASE}/admin/users`, {
      params,
      withCredentials: true, // Send authentication cookies
    });

    // The backend returns data in response.data.data format
    return response.data.data;
  } catch (error) {
    console.error("Fetch users error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch users"
    );
  }
}

// /**
//  * Create a new user
//  * @param userData - User data to create
//  * @returns Promise with created user data
//  */
export async function createUser(userData: UserFormData) {
  try {
    // Make POST request to /api/admin/users with user data
    // withCredentials: true sends cookies for authentication
    const response = await axios.post(`${API_BASE}/admin/users`, userData, {
      withCredentials: true,
    });

    // Return the created user data
    return response.data.data;
  } catch (error) {
    console.error("Create user error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create user"
    );
  }
}

// /**
//  * Update an existing user
//  * @param userId - ID of the user to update
//  * @param userData - Updated user data
//  * @returns Promise with updated user data
//  */

export async function updateUser(
  userId: string,
  userData: Partial<UserFormData>
) {
  try {
    // Make PUT request to /api/admin/users/:id with updated data
    const response = await axios.put(
      `${API_BASE}/admin/users/${userId}`,
      userData,
      { withCredentials: true }
    );

    // Return the updated user data
    return response.data.data;
  } catch (error) {
    console.error("Update user error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update user"
    );
  }
}

// /**
//  * Delete a user
//  * @param userId - ID of the user to delete
//  * @returns Promise with deletion confirmation
//  */

export async function deleteUser(userId: string) {
  try {
    // Make DELETE request to /api/admin/users/:id
    const response = await axios.delete(`${API_BASE}/admin/users/${userId}`, {
      withCredentials: true,
    });

    // Return the deletion confirmation
    return response.data.data;
  } catch (error) {
    console.error("Delete user error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete user"
    );
  }
}

// /**
//  * Get a single user by ID
//  * @param userId - ID of the user to fetch
//  * @returns Promise with user data
//  */

export async function getUserById(userId: string): Promise<UserType> {
  try {
    // Make GET request to /api/admin/users/:id
    const response = await axios.get(`${API_BASE}/admin/users/${userId}`, {
      withCredentials: true,
    });

    // Return the user data
    return response.data.data;
  } catch (error) {
    console.error("Get user by ID error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch user"
    );
  }
}

// /**
//  * Get available user roles for dropdown/select options
//  * @returns Promise with array of role strings
//  */

export async function getUserRoles(): Promise<string[]> {
  try {
    // Make GET request to /api/admin/users/roles
    const response = await axios.get(`${API_BASE}/admin/users/roles`, {
      withCredentials: true,
    });

    // Return the roles array
    return response.data.data;
  } catch (error) {
    console.error("Get user roles error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch user roles"
    );
  }
}

export const getProfile = async () => {
  const response = await axios.get(`${API_BASE_URL}/user/profile`, {
    withCredentials: true,
  });
  if (!response.data.success) throw new Error("Failed to fetch user profile");
  return response.data.user;
};
