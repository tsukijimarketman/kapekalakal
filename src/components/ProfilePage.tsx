import React, { useState, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { FiEdit3, FiSave, FiEye, FiEyeOff } from "react-icons/fi";
import Lottie from "./Lottie";
import { API_ENDPOINTS, fetchWithCredentials } from "../config/api";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [profileImage, setProfileImage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    sex: "",
    address: "",
    contactNumber: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user/profile-image`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {
        setProfileImage(data.url);
        // Optionally update the user data if returned
        if (data.user) {
          setFormData((prev) => ({
            ...prev,
            firstName: data.user.firstName || "",
            lastName: data.user.lastName || "",
            email: data.user.email || "",
            age: data.user.age ? String(data.user.age) : "",
            sex: data.user.sex || "",
            address: data.user.address || "",
            contactNumber: data.user.contactNumber || "",
          }));
        }
        toast.success("Profile image updated successfully!");
      } else {
        toast.error(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "age") {
      // Only allow numbers
      if (!/^\d*$/.test(value)) return;
    }
    if (field === "contactNumber") {
      // Allow numbers, spaces, +, -, and parentheses
      if (!/^[0-9\s+\-()]*$/.test(value)) return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Password validation function
  const validatePassword = (
    password: string
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least 1 uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least 1 lowercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least 1 number");
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push(
        "Password must contain at least 1 special character (@$!%*?&)"
      );
    }

    return { isValid: errors.length === 0, errors };
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, color: "gray", text: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    const strengthMap = {
      0: { color: "gray", text: "Very Weak" },
      1: { color: "red", text: "Weak" },
      2: { color: "orange", text: "Fair" },
      3: { color: "yellow", text: "Good" },
      4: { color: "lightgreen", text: "Strong" },
      5: { color: "green", text: "Very Strong" },
    };

    return { strength, ...strengthMap[strength as keyof typeof strengthMap] };
  };

  const handleSave = async () => {
    // Validation for profile fields
    if (isEditing) {
      if (
        formData.age &&
        (parseInt(formData.age) < 1 || parseInt(formData.age) > 120)
      ) {
        toast.error("Please enter a valid age");
        return;
      }
    }

    // Validation for password fields
    if (isChangingPassword) {
      if (
        !passwordData.oldPassword ||
        !passwordData.newPassword ||
        !passwordData.confirmPassword
      ) {
        toast.error("Please fill all password fields");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("New password and confirm password do not match");
        return;
      }

      const passwordValidation = validatePassword(passwordData.newPassword);
      if (!passwordValidation.isValid) {
        toast.error(passwordValidation.errors[0]);
        return;
      }
    }

    try {
      setLoading(true);
      setError("");

      // Prepare request body based on what's being updated
      const requestBody: Record<string, unknown> = {};

      // Add profile fields if editing
      if (isEditing) {
        requestBody.firstName = formData.firstName;
        requestBody.lastName = formData.lastName;
        requestBody.age = formData.age ? Number(formData.age) : undefined;
        requestBody.sex = formData.sex;
        requestBody.address = formData.address;
        requestBody.contactNumber = formData.contactNumber;
      }

      // Add password fields if changing password
      if (isChangingPassword) {
        requestBody.currentPassword = passwordData.oldPassword;
        requestBody.newPassword = passwordData.newPassword;
        requestBody.confirmPassword = passwordData.confirmPassword;
      }

      const res = await fetchWithCredentials(API_ENDPOINTS.USER.PROFILE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (data.success) {
        // Update form data with response
        if (data.user) {
          setFormData({
            firstName: data.user.firstName || "",
            lastName: data.user.lastName || "",
            email: data.user.email || "",
            age: data.user.age ? String(data.user.age) : "",
            sex: data.user.sex || "",
            address: data.user.address || "",
            contactNumber: data.user.contactNumber || "",
          });
          setProfileImage(data.user.profileImage || "");
        }

        // Clear password fields if password was changed
        if (isChangingPassword) {
          setPasswordData({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }

        // Reset edit states
        setIsEditing(false);
        setIsChangingPassword(false);

        // Show success message
        toast.success(data.message || "Profile updated successfully!");
      } else {
        setError(data.error || "Failed to update profile");
        toast.error(data.error || "Failed to update profile");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to update profile: ${errorMessage}`);
      toast.error(`Failed to update profile: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchWithCredentials(API_ENDPOINTS.USER.PROFILE, {
          credentials: "include",
          cache: "no-store",
        });
        const text = await res.text();
        console.log("Profile fetch response:", text); // Debug: see the actual response

        if (!text) {
          setError("Empty response from server.");
          toast.error("Empty response from server.");
          setLoading(false);
          return;
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          setError("Failed to parse profile response: " + text);
          toast.error("Failed to parse profile response: " + text);
          setLoading(false);
          return;
        }

        if (data.success) {
          setFormData({
            firstName: data.user.firstName || "",
            lastName: data.user.lastName || "",
            email: data.user.email || "",
            age: data.user.age ? String(data.user.age) : "",
            sex: data.user.sex || "",
            address: data.user.address || "",
            contactNumber: data.user.contactNumber || "",
          });
          setProfileImage(data.user.profileImage || "");
        } else {
          setError(data.error || "Failed to fetch profile");
          toast.error(data.error || "Failed to fetch profile");
        }
      } catch (error) {
        setError(`Failed to fetch profile ${error}`);
        toast.error(`Failed to fetch profile ${error}`);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Lottie />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Main Content */}

      <div
        className="bg-white rounded shadow-xl overflow-hidden"
        style={{ backgroundColor: "#efe8d2" }}
      >
        {/* Profile Header */}
        <div
          className="relative bg-gradient-to-r from-amber-700 to-amber-600 px-6 py-8 md:px-8 md:py-12"
          style={{
            background: "linear-gradient(135deg, #7a4e2e 0%, #996936 100%)",
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <div
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-amber-100 border-4 border-amber-200 shadow-lg overflow-hidden group-hover:shadow-xl transition-all duration-300"
                  style={{ borderColor: "#e1d0a7" }}
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-amber-700"
                      style={{ color: "#7a4e2e" }}
                    >
                      <CgProfile size={48} className="md:w-16 md:h-16" />
                    </div>
                  )}
                </div>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* User Info */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-50 mb-2">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-amber-200 text-lg">{formData.email}</p>
              <div className="mt-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-2 bg-amber-100 text-amber-800 rounded-full font-medium hover:bg-amber-200 transition-colors duration-200"
                  style={{ backgroundColor: "#e1d0a7", color: "#331d15" }}
                >
                  <FiEdit3 size={16} />
                  {isEditing ? "Cancel Edit" : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3
                className="text-xl font-semibold mb-4"
                style={{ color: "#331d15" }}
              >
                Personal Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#59382a" }}
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg border-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                    style={{
                      borderColor: "#d0b274",
                      backgroundColor: "#f9f6ed",
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#59382a" }}
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg border-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                    style={{
                      borderColor: "#d0b274",
                      backgroundColor: "#f9f6ed",
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#59382a" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg border-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                    style={{
                      borderColor: "#d0b274",
                      backgroundColor: "#f9f6ed",
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#59382a" }}
                  >
                    Age
                  </label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 ${
                      isEditing
                        ? "border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200"
                        : "bg-gray-50 text-gray-500 cursor-not-allowed"
                    }`}
                    style={{
                      borderColor: isEditing ? "#c1974e" : "#d0b274",
                      backgroundColor: isEditing ? "white" : "#f9f6ed",
                    }}
                    placeholder="Enter your age"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#59382a" }}
                  >
                    Sex
                  </label>
                  <select
                    value={formData.sex}
                    onChange={(e) => handleInputChange("sex", e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 ${
                      isEditing
                        ? "border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200"
                        : "bg-gray-50 text-gray-500 cursor-not-allowed"
                    }`}
                    style={{
                      borderColor: isEditing ? "#c1974e" : "#d0b274",
                      backgroundColor: isEditing ? "white" : "#f9f6ed",
                    }}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h3
                className="text-xl font-semibold mb-4"
                style={{ color: "#331d15" }}
              >
                Contact Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#59382a" }}
                  >
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    readOnly={!isEditing}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 resize-none ${
                      isEditing
                        ? "border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200"
                        : "bg-gray-50 text-gray-500 cursor-not-allowed"
                    }`}
                    style={{
                      borderColor: isEditing ? "#c1974e" : "#d0b274",
                      backgroundColor: isEditing ? "white" : "#f9f6ed",
                    }}
                    placeholder="Enter your complete address"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#59382a" }}
                  >
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      handleInputChange("contactNumber", e.target.value)
                    }
                    readOnly={!isEditing}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 ${
                      isEditing
                        ? "border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200"
                        : "bg-gray-50 text-gray-500 cursor-not-allowed"
                    }`}
                    style={{
                      borderColor: isEditing ? "#c1974e" : "#d0b274",
                      backgroundColor: isEditing ? "white" : "#f9f6ed",
                    }}
                    placeholder="Enter your contact number"
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="mt-8">
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ color: "#331d15" }}
                >
                  Password
                </h3>

                {!isChangingPassword ? (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="cursor-pointer px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200"
                    style={{ backgroundColor: "#996936" }}
                  >
                    Change Password
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#59382a" }}
                      >
                        Current Password
                      </label>
                      <input
                        type={showPasswords.old ? "text" : "password"}
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          handlePasswordChange("oldPassword", e.target.value)
                        }
                        className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200"
                        style={{ borderColor: "#c1974e" }}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("old")}
                        className="absolute right-3 top-11 text-gray-500"
                      >
                        {showPasswords.old ? (
                          <FiEyeOff size={20} />
                        ) : (
                          <FiEye size={20} />
                        )}
                      </button>
                    </div>

                    <div className="relative">
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#59382a" }}
                      >
                        New Password
                      </label>
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          handlePasswordChange("newPassword", e.target.value)
                        }
                        className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200"
                        style={{ borderColor: "#c1974e" }}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-11 text-gray-500"
                      >
                        {showPasswords.new ? (
                          <FiEyeOff size={20} />
                        ) : (
                          <FiEye size={20} />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {passwordData.newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="text-sm font-medium"
                            style={{ color: "#59382a" }}
                          >
                            Password Strength:
                          </div>
                          <div
                            className="text-sm font-semibold"
                            style={{
                              color: getPasswordStrength(
                                passwordData.newPassword
                              ).color,
                            }}
                          >
                            {getPasswordStrength(passwordData.newPassword).text}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                (getPasswordStrength(passwordData.newPassword)
                                  .strength /
                                  5) *
                                100
                              }%`,
                              backgroundColor: getPasswordStrength(
                                passwordData.newPassword
                              ).color,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="relative">
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#59382a" }}
                      >
                        Confirm New Password
                      </label>
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          handlePasswordChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200"
                        style={{ borderColor: "#c1974e" }}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-11 text-gray-500"
                      >
                        {showPasswords.confirm ? (
                          <FiEyeOff size={20} />
                        ) : (
                          <FiEye size={20} />
                        )}
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setIsChangingPassword(false);
                          setPasswordData({
                            oldPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          {(isEditing || isChangingPassword) && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSave}
                className="cursor-pointer inline-flex items-center gap-2 px-8 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors duration-200 shadow-lg"
                style={{ backgroundColor: "#996936" }}
              >
                <FiSave size={20} />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
