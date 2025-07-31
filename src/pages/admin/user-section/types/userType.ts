export interface UserType {
  _id: string; // MongoDB ObjectId
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin" | "delivery";
  age?: number;
  sex?: "Male" | "Female" | "Other";
  address?: string;
  contactNumber?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "admin" | "delivery";
  age?: number;
  sex?: "Male" | "Female" | "Other";
  address?: string;
  contactNumber?: string;
  profileImage?: string;
}

export const USER_ROLES = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
  { value: "delivery", label: "Delivery" },
] as const;

export const SEX_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
] as const;

export type SortField = "lastName" | "email" | "role" | "createdAt";
export type SortOrder = "asc" | "desc";
