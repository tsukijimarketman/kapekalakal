import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaSpinner,
  FaExclamationTriangle,
  FaUsers,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaCalendarAlt,
} from "react-icons/fa";
import { type UserType, type UserFormData } from "./types/userType";
import UserForm from "./UserForm";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserRoles,
  type FetchUsersParams,
} from "../../../services/usersApi";
import Lottie from "../../../components/Lottie";

const UsersManagement: React.FC = () => {
  // State for users data from backend
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [sortField, setSortField] = useState<
    "firstName" | "lastName" | "email" | "role" | "createdAt"
  >("lastName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // State for modals and forms
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [viewingUser, setViewingUser] = useState<UserType | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserType | null>(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State for available roles
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);

  // State for action loading
  const [actionLoading, setActionLoading] = useState(false);

  // Debounce search and load users
  useEffect(() => {
    setLoading(true);
    setError(null);
    const handler = setTimeout(() => {
      loadUsers();
    }, 400); // 400ms debounce
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedRole, sortField, sortOrder, currentPage]);

  // Load available roles on component mount
  useEffect(() => {
    loadAvailableRoles();
  }, []);

  // Function to load users from backend API
  const loadUsers = async () => {
    try {
      const params: FetchUsersParams = {
        search: searchTerm,
        role: selectedRole === "all" ? undefined : selectedRole,
        sortBy: sortField,
        sortOrder: sortOrder,
        page: currentPage,
        limit: itemsPerPage,
      };

      const data = await fetchUsers(params);

      setUsers(data.users);
      setPagination(data.pagination);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
      setLoading(false);
    }
  };

  // Function to load available roles
  const loadAvailableRoles = async () => {
    try {
      const roles = await getUserRoles();
      setAvailableRoles(roles);
    } catch (err: any) {
      console.error("Failed to load roles:", err.message);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle role filter change
  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle sort change
  const handleSortChange = (field: typeof sortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting
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
    setIsViewModalOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = (user: UserType) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (formData: UserFormData) => {
    try {
      setActionLoading(true);

      if (formMode === "create") {
        await createUser(formData);
        toast.success("User created successfully!");
      } else if (editingUser) {
        await updateUser(editingUser._id, formData);
        toast.success("User updated successfully!");
      }

      setIsFormOpen(false);
      setEditingUser(null);
      loadUsers(); // Refresh the user list
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    try {
      setActionLoading(true);
      await deleteUser(deletingUser._id);
      toast.success("User deleted successfully!");
      setIsDeleteModalOpen(false);
      setDeletingUser(null);
      loadUsers(); // Refresh the user list
    } catch (err: any) {
      toast.error(err.message);
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
          {availableRoles.map((role) => (
            <button
              key={role}
              onClick={() => handleRoleFilter(role)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedRole === role
                  ? "bg-[#986836] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#7a4e2e] dark:text-[#e1d0a7] dark:hover:bg-[#996936]"
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Lottie />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadUsers}
              className="px-4 py-2 bg-[#b28341] text-[#f9f6ed] rounded-md hover:bg-[#8b6332] transition-colors"
            >
              Try Again
            </button>
          </div>
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
                      onClick={() => handleSortChange("firstName")}
                      className="flex items-center gap-1 hover:text-[#986836] transition-colors"
                    >
                      <FaUser className="mr-1" />
                      Name
                      {sortField === "firstName" && (
                        <span className="text-[#b28341]">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#e1d0a7] uppercase tracking-wider">
                    <button
                      onClick={() => handleSortChange("email")}
                      className="flex items-center gap-1 hover:text-[#986836] transition-colors"
                    >
                      <FaEnvelope className="mr-1" />
                      Email
                      {sortField === "email" && (
                        <span className="text-[#b28341]">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#e1d0a7] uppercase tracking-wider">
                    <button
                      onClick={() => handleSortChange("role")}
                      className="flex items-center gap-1 hover:text-[#986836] transition-colors"
                    >
                      <FaUserTag className="mr-1" />
                      Role
                      {sortField === "role" && (
                        <span className="text-[#b28341]">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#e1d0a7] uppercase tracking-wider">
                    <button
                      onClick={() => handleSortChange("createdAt")}
                      className="flex items-center gap-1 hover:text-[#986836] transition-colors"
                    >
                      <FaCalendarAlt className="mr-1" />
                      Created
                      {sortField === "createdAt" && (
                        <span className="text-[#b28341]">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#e1d0a7] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#67412c] divide-y divide-gray-200 dark:divide-[#7a4e2e]">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500 dark:text-[#e1d0a7]"
                    >
                      <FaUsers className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-lg">
                        {searchTerm || selectedRole !== "all"
                          ? "No users found matching your criteria"
                          : "No users found"}
                      </p>
                      {(searchTerm || selectedRole !== "all") && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setSelectedRole("all");
                            setCurrentPage(1);
                          }}
                          className="mt-4 px-4 py-2 text-[#b28341] hover:bg-[#b28341] hover:text-white border border-[#b28341] rounded-md transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 dark:hover:bg-[#7a4e2e] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.profileImage ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={user.profileImage}
                                alt={`${user.firstName} ${user.lastName}`}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-[#986836] flex items-center justify-center">
                                <FaUser className="text-white" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#7a4e2e] dark:text-[#e1d0a7]">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#7a4e2e] dark:text-[#e1d0a7]">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="text-[#986836] hover:text-[#7a4e2e] transition-colors"
                            title="View user"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            title="Edit user"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
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
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && !error && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 rounded bg-[#e1d0a7] dark:bg-[#7a4e2e] text-[#7a4e2e] dark:text-[#e1d0a7] font-medium disabled:opacity-50"
              disabled={pagination.currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            {/* Page Numbers */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  className={`px-3 py-1 rounded font-medium border transition-colors duration-200 ${
                    page === pagination.currentPage
                      ? "bg-[#b28341] text-[#f9f6ed] border-[#b28341]"
                      : "bg-transparent text-[#7a4e2e] dark:text-[#e1d0a7] border-[#e1d0a7] dark:border-[#7a4e2e] hover:bg-[#e1d0a7] dark:hover:bg-[#7a4e2e]"
                  }`}
                  onClick={() => setCurrentPage(page)}
                  disabled={page === pagination.currentPage}
                >
                  {page}
                </button>
              )
            )}
            <button
              className="px-3 py-1 rounded bg-[#e1d0a7] dark:bg-[#7a4e2e] text-[#7a4e2e] dark:text-[#e1d0a7] font-medium disabled:opacity-50"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      <UserForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleFormSubmit}
        editingUser={editingUser}
        mode={formMode}
        loading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#67412c] rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-4">
              Delete User
            </h3>
            <p className="text-[#996936] dark:text-[#e1d0a7] mb-6">
              Are you sure you want to delete {deletingUser?.firstName}{" "}
              {deletingUser?.lastName}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-[#e1d0a7] dark:bg-[#7a4e2e] dark:hover:bg-[#996936] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
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
      {isViewModalOpen && viewingUser && (
        <div className="fixed inset-0 bg-black opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#67412c] rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                User Details
              </h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-3">
                  Personal Information
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
                <h4 className="font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-3">
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
