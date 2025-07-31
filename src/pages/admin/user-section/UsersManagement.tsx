import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaEye,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  type UserType,
  type UserFormData,
  type SortField,
  type SortOrder,
} from "./types/userType";
import UserForm from "./UserForm";
import Lottie from "../../../components/Lottie";

// Mock data for demonstration (replace with API calls later)
const mockUsers: UserType[] = [
  {
    _id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: "user",
    age: 25,
    sex: "Male",
    address: "123 Main St, City",
    contactNumber: "+1234567890",
    profileImage: "",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    _id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    role: "admin",
    age: 30,
    sex: "Female",
    address: "456 Oak Ave, Town",
    contactNumber: "+1234567891",
    profileImage: "",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    _id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@example.com",
    role: "delivery",
    age: 28,
    sex: "Male",
    address: "789 Pine Rd, Village",
    contactNumber: "+1234567892",
    profileImage: "",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    _id: "4",
    firstName: "Sarah",
    lastName: "Wilson",
    email: "sarah.wilson@example.com",
    role: "user",
    age: 22,
    sex: "Female",
    address: "321 Elm St, Borough",
    contactNumber: "+1234567893",
    profileImage: "",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
];

const UsersManagement: React.FC = () => {
  // State for users data
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  // State for sorting
  const [sortField, setSortField] = useState<SortField>("lastName");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // State for form and actions
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewingUser, setViewingUser] = useState<UserType | null>(null);

  // State for action loading
  const [actionLoading, setActionLoading] = useState(false);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Mock function to load users (replace with API call)
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUsers(mockUsers);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter((user) => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = selectedRole === "all" || user.role === selectedRole;

      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "lastName":
          aValue = a.lastName.toLowerCase();
          bValue = b.lastName.toLowerCase();
          break;
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "role":
          aValue = a.role;
          bValue = b.role;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = a.lastName.toLowerCase();
          bValue = b.lastName.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredAndSortedUsers.slice(startIndex, endIndex);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <FaSort className="text-gray-400" />;
    }
    return sortOrder === "asc" ? (
      <FaSortUp className="text-[#986836]" />
    ) : (
      <FaSortDown className="text-[#986836]" />
    );
  };

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle role filter
  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    setCurrentPage(1);
  };

  // Handle create user
  const handleCreateUser = () => {
    setFormMode("create");
    setEditingUser(null);
    setIsFormOpen(true);
  };

  // Handle edit user
  const handleEditUser = (user: UserType) => {
    setFormMode("edit");
    setEditingUser(user);
    setIsFormOpen(true);
  };

  // Handle view user
  const handleViewUser = (user: UserType) => {
    setViewingUser(user);
  };

  // Handle delete user
  const handleDeleteUser = (userId: string) => {
    setDeleteConfirm(userId);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      setActionLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUsers(users.filter((user) => user._id !== deleteConfirm));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle form submit
  const handleFormSubmit = async (formData: UserFormData) => {
    try {
      setActionLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (formMode === "create") {
        const newUser: UserType = {
          _id: Date.now().toString(),
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setUsers([...users, newUser]);
      } else if (editingUser) {
        setUsers(
          users.map((user) =>
            user._id === editingUser._id
              ? { ...user, ...formData, updatedAt: new Date() }
              : user
          )
        );
      }

      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Format date
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "delivery":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
            Users Management
          </h2>
          <p className="text-[#996936] dark:text-[#e1d0a7]">
            Manage user accounts and permissions
          </p>
        </div>
        <button
          onClick={handleCreateUser}
          className="flex items-center gap-2 px-4 py-2 bg-[#986836] text-white rounded-md hover:bg-[#7a4e2e] transition-colors"
        >
          <FaPlus size={16} />
          Add New User
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#986836] dark:bg-[#7a4e2e] dark:text-[#e1d0a7] dark:border-[#7a4e2e]"
            />
          </div>
        </div>

        {/* Role Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => handleRoleFilter("all")}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedRole === "all"
                ? "bg-[#986836] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#7a4e2e] dark:text-[#e1d0a7] dark:hover:bg-[#996936]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleRoleFilter("user")}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedRole === "user"
                ? "bg-[#986836] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#7a4e2e] dark:text-[#e1d0a7] dark:hover:bg-[#996936]"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => handleRoleFilter("admin")}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedRole === "admin"
                ? "bg-[#986836] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#7a4e2e] dark:text-[#e1d0a7] dark:hover:bg-[#996936]"
            }`}
          >
            Admins
          </button>
          <button
            onClick={() => handleRoleFilter("delivery")}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedRole === "delivery"
                ? "bg-[#986836] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#7a4e2e] dark:text-[#e1d0a7] dark:hover:bg-[#996936]"
            }`}
          >
            Delivery
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Lottie />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Users Table */}
      {!loading && !error && (
        <div className="bg-white dark:bg-[#67412c] rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#7a4e2e]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#e1d0a7] uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("lastName")}
                      className="flex items-center gap-1 hover:text-[#986836] transition-colors"
                    >
                      <FaUser className="mr-1" />
                      Name
                      {getSortIcon("lastName")}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#e1d0a7] uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("email")}
                      className="flex items-center gap-1 hover:text-[#986836] transition-colors"
                    >
                      <FaEnvelope className="mr-1" />
                      Email
                      {getSortIcon("email")}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#e1d0a7] uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("role")}
                      className="flex items-center gap-1 hover:text-[#986836] transition-colors"
                    >
                      <FaUserTag className="mr-1" />
                      Role
                      {getSortIcon("role")}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#e1d0a7] uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("createdAt")}
                      className="flex items-center gap-1 hover:text-[#986836] transition-colors"
                    >
                      <FaCalendarAlt className="mr-1" />
                      Created
                      {getSortIcon("createdAt")}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#e1d0a7] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#67412c] divide-y divide-gray-200 dark:divide-[#7a4e2e]">
                {currentUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500 dark:text-[#e1d0a7]"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 dark:hover:bg-[#7a4e2e] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-[#986836] flex items-center justify-center">
                              <span className="text-white font-medium">
                                {user.firstName.charAt(0)}
                                {user.lastName.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-[#996936] dark:text-[#e1d0a7]">
                              {user.age
                                ? `${user.age} years old`
                                : "Age not specified"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#7a4e2e] dark:text-[#e1d0a7]">
                          {user.email}
                        </div>
                        <div className="text-sm text-[#996936] dark:text-[#e1d0a7]">
                          {user.contactNumber || "No contact number"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#7a4e2e] dark:text-[#e1d0a7]">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            title="View user details"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                            title="Edit user"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            title="Delete user"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white dark:bg-[#67412c] px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-[#7a4e2e] sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-[#7a4e2e] dark:text-[#e1d0a7]">
                    Showing{" "}
                    <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(endIndex, filteredAndSortedUsers.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredAndSortedUsers.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? "z-10 bg-[#986836] border-[#986836] text-white"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* User Form Modal */}
      <UserForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        user={editingUser}
        mode={formMode}
        loading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#67412c] rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-4">
              Confirm Delete
            </h3>
            <p className="text-[#996936] dark:text-[#e1d0a7] mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-[#e1d0a7] dark:bg-[#7a4e2e] dark:hover:bg-[#996936] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#67412c] rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#7a4e2e] dark:text-[#e1d0a7]">
                User Details
              </h3>
              <button
                onClick={() => setViewingUser(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
                  Basic Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {viewingUser.firstName} {viewingUser.lastName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {viewingUser.email}
                  </p>
                  <p>
                    <span className="font-medium">Role:</span>
                    <span
                      className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                        viewingUser.role
                      )}`}
                    >
                      {viewingUser.role.charAt(0).toUpperCase() +
                        viewingUser.role.slice(1)}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Age:</span>{" "}
                    {viewingUser.age || "Not specified"}
                  </p>
                  <p>
                    <span className="font-medium">Sex:</span>{" "}
                    {viewingUser.sex || "Not specified"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
                  Contact Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Contact Number:</span>{" "}
                    {viewingUser.contactNumber || "Not specified"}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {viewingUser.address || "Not specified"}
                  </p>
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {formatDate(viewingUser.createdAt)}
                  </p>
                  <p>
                    <span className="font-medium">Last Updated:</span>{" "}
                    {formatDate(viewingUser.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
