import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserTag,
  FaCalendarAlt,
  FaVenusMars,
  FaMapMarkerAlt,
  FaPhone,
  FaImage,
} from "react-icons/fa";
import {
  type UserType,
  type UserFormData,
  USER_ROLES,
  SEX_OPTIONS,
} from "./types/userType";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: UserFormData) => void;
  editingUser?: UserType | null; // Changed from 'user' to 'editingUser' to match UsersManagement
  mode: "create" | "edit";
  loading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingUser, // Changed from 'user' to 'editingUser'
  mode,
  loading = false,
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
    age: undefined,
    sex: undefined,
    address: "",
    contactNumber: "",
    profileImage: "",
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  // Initialize form data when editing
  useEffect(() => {
    if (editingUser && mode === "edit") {
      // Changed from 'user' to 'editingUser'
      setFormData({
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
        password: "", // Don't populate password for edit mode
        role: editingUser.role,
        age: editingUser.age,
        sex: editingUser.sex,
        address: editingUser.address || "",
        contactNumber: editingUser.contactNumber || "",
        profileImage: editingUser.profileImage || "",
      });
    } else {
      // Reset form for create mode
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "user",
        age: undefined,
        sex: undefined,
        address: "",
        contactNumber: "",
        profileImage: "",
      });
    }
    setErrors({});
  }, [editingUser, mode, isOpen]); // Changed from 'user' to 'editingUser'

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? (value ? parseInt(value) : undefined) : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof UserFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Only require password for create mode
    if (mode === "create" && !formData.password) {
      newErrors.password = "Password is required";
    } else if (
      mode === "create" &&
      formData.password &&
      formData.password.length < 6
    ) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (
      formData.age !== undefined &&
      (formData.age < 1 || formData.age > 120)
    ) {
      newErrors.age = "Age must be between 1 and 120";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // For edit mode, only send password if it's provided
      const submitData = { ...formData };
      if (mode === "edit" && !submitData.password) {
        delete submitData.password;
      }
      onSubmit(submitData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#67412c] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#7a4e2e]">
          <h2 className="text-xl font-bold text-[#7a4e2e] dark:text-[#e1d0a7]">
            {mode === "create" ? "Create New User" : "Edit User"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            disabled={loading}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
                <FaUser className="inline mr-2" />
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b28341] dark:bg-[#59382a] dark:text-[#e1d0a7] ${
                  errors.firstName
                    ? "border-red-500"
                    : "border-[#e1d0a7] dark:border-[#7a4e2e]"
                }`}
                placeholder="Enter first name"
                disabled={loading}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
                <FaUser className="inline mr-2" />
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b28341] dark:bg-[#59382a] dark:text-[#e1d0a7] ${
                  errors.lastName
                    ? "border-red-500"
                    : "border-[#e1d0a7] dark:border-[#7a4e2e]"
                }`}
                placeholder="Enter last name"
                disabled={loading}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
              <FaEnvelope className="inline mr-2" />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b28341] dark:bg-[#59382a] dark:text-[#e1d0a7] ${
                errors.email
                  ? "border-red-500"
                  : "border-[#e1d0a7] dark:border-[#7a4e2e]"
              }`}
              placeholder="Enter email address"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
              <FaLock className="inline mr-2" />
              Password{" "}
              {mode === "create" ? "*" : "(leave blank to keep current)"}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b28341] dark:bg-[#59382a] dark:text-[#e1d0a7] ${
                errors.password
                  ? "border-red-500"
                  : "border-[#e1d0a7] dark:border-[#7a4e2e]"
              }`}
              placeholder={
                mode === "create"
                  ? "Enter password"
                  : "Leave blank to keep current password"
              }
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
              <FaUserTag className="inline mr-2" />
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-[#e1d0a7] dark:border-[#7a4e2e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b28341] dark:bg-[#59382a] dark:text-[#e1d0a7]"
              disabled={loading}
            >
              {USER_ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
                <FaCalendarAlt className="inline mr-2" />
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age || ""}
                onChange={handleInputChange}
                min="1"
                max="120"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b28341] dark:bg-[#59382a] dark:text-[#e1d0a7] ${
                  errors.age
                    ? "border-red-500"
                    : "border-[#e1d0a7] dark:border-[#7a4e2e]"
                }`}
                placeholder="Enter age"
                disabled={loading}
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">{errors.age}</p>
              )}
            </div>

            {/* Sex */}
            <div>
              <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
                <FaVenusMars className="inline mr-2" />
                Sex
              </label>
              <select
                name="sex"
                value={formData.sex || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#e1d0a7] dark:border-[#7a4e2e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b28341] dark:bg-[#59382a] dark:text-[#e1d0a7]"
                disabled={loading}
              >
                <option value="">Select sex</option>
                {SEX_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
                <FaPhone className="inline mr-2" />
                Contact Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#e1d0a7] dark:border-[#7a4e2e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b28341] dark:bg-[#59382a] dark:text-[#e1d0a7]"
                placeholder="Enter contact number"
                disabled={loading}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
              <FaMapMarkerAlt className="inline mr-2" />
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={(e) => handleInputChange(e as any)}
              rows={3}
              className="w-full px-3 py-2 border border-[#e1d0a7] dark:border-[#7a4e2e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b28341] dark:bg-[#59382a] dark:text-[#e1d0a7]"
              placeholder="Enter address"
              disabled={loading}
            />
          </div>

          {/* Profile Image URL */}
          <div>
            <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
              <FaImage className="inline mr-2" />
              Profile Image URL
            </label>
            <input
              type="url"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-[#e1d0a7] dark:border-[#7a4e2e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b28341] dark:bg-[#59382a] dark:text-[#e1d0a7]"
              placeholder="Enter profile image URL"
              disabled={loading}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-[#7a4e2e]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#7a4e2e] dark:text-[#e1d0a7] bg-[#e1d0a7] dark:bg-[#7a4e2e] rounded-md hover:bg-[#d0b274] dark:hover:bg-[#996936] transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#b28341] text-[#f9f6ed] rounded-md hover:bg-[#8b6332] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading
                ? "Saving..."
                : mode === "create"
                ? "Create User"
                : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
