import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

import bgVideo from "../../assets/video/auth_bg.mp4";
import Lottie from "../../components/Lottie";

const Signup = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      const redirectMap = {
        admin: "/admin",
        delivery: "/delivery",
        user: "/user",
      };
      navigate(redirectMap[user.role], { replace: true });
    }
  }, [user, loading, navigate]);

  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name) && name.trim().length > 0;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid:
        minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar,
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
    };
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    // Clear all errors
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let hasErrors = false;

    // Validate first name
    if (!firstName.trim()) {
      setFirstNameError("First name is required");
      hasErrors = true;
    } else if (!validateName(firstName)) {
      setFirstNameError("First name can only contain letters and spaces");
      hasErrors = true;
    }

    // Validate last name
    if (!lastName.trim()) {
      setLastNameError("Last name is required");
      hasErrors = true;
    } else if (!validateName(lastName)) {
      setLastNameError("Last name can only contain letters and spaces");
      hasErrors = true;
    }

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      hasErrors = true;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasErrors = true;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      hasErrors = true;
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setPasswordError("Password must meet all requirements");
        hasErrors = true;
      }
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      hasErrors = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasErrors = true;
    }

    // If there are errors, don't proceed
    if (hasErrors) return;

    setIsSubmitting(true);

    try {
      const requestBody = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      };

      console.log("Sending signup request:", requestBody);

      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("Signup response:", data);

      if (data.success) {
        toast.success("Account created successfully! Please sign in.");
        navigate("/signin");
      } else {
        // Handle specific error messages
        if (data.message === "Email already exists!") {
          setEmailError(
            "Email already exists. Please use a different email or sign in."
          );
          toast.error(
            "Email already exists. Please use a different email or sign in."
          );
        } else {
          toast.error(
            data.message || "Failed to create account. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordValidation = validatePassword(password);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Lottie />
      </div>
    );
  }

  return (
    <div className="h-[100vh] w-[100vw] flex relative overflow-hidden">
      <div className="h-full w-[50%] flex flex-col items-center justify-center">
        <video
          src={bgVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-[-10] border-none"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[#b18341] opacity-50 z-[-5]" />

        <div className="flex flex-col items-center gap-2  mb-20">
          <p className="text-3xl sm:text-3xl md:text-5xl lg:text-6xl   font-bold text-[#331d15]">
            Welcome to
          </p>
          <p className="text-5xl sm:text-5xl md:text-7xl lg:text-8xl   font-black text-[#331d15] ">
            Kape Kalakal
          </p>
          <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl   font-bold text-[#331d15]">
            Local brews, curated mugs, and coffee essentials.
          </p>
        </div>
        <Link to="/">
          <button className="m-5 absolute left-0 top-0 text-xl lg:text-xl hover-scale cursor-pointer text-[#efe8d2] p-3 flex items-center justify-center">
            <IoIosArrowBack className="text-xl" /> Go Back
          </button>
        </Link>
      </div>
      <div className="bg-gradient-to-br flex items-center justify-center h-full w-[50%]">
        <div className="w-full bg-white shadow-2xl overflow-hidden m-15 rounded-2xl">
          <div className="bg-[#331d15] px-8 py-6 text-center">
            <h2 className="text-2xl font-bold text-[#e1d0a7] mb-2">
              Join KapeKalakal
            </h2>
            <p className="text-[#c1974e] text-xs">
              Create your coffee journey account
            </p>
          </div>

          <div className="px-8 py-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#331d15] mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setFirstNameError("");
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#996936] focus:border-transparent outline-none transition-all ${
                  firstNameError ? "border-red-500" : "border-[#c1974e]"
                }`}
                placeholder="Enter your first name"
                disabled={isSubmitting}
              />
              {firstNameError && (
                <p className="mt-1 text-xs text-red-600">{firstNameError}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#331d15] mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setLastNameError("");
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#996936] focus:border-transparent outline-none transition-all ${
                  lastNameError ? "border-red-500" : "border-[#c1974e]"
                }`}
                placeholder="Enter your last name"
                disabled={isSubmitting}
              />
              {lastNameError && (
                <p className="mt-1 text-xs text-red-600">{lastNameError}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#331d15] mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#996936] focus:border-transparent outline-none transition-all ${
                  emailError ? "border-red-500" : "border-[#c1974e]"
                }`}
                placeholder="Enter your email address"
                disabled={isSubmitting}
              />
              {emailError && (
                <p className="mt-1 text-xs text-red-600">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#331d15] mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#996936] focus:border-transparent outline-none transition-all ${
                    passwordError ? "border-red-500" : "border-[#c1974e]"
                  }`}
                  placeholder="Create a strong password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-[#67412c] hover:text-[#331d15] transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>

              {password && (
                <div className="mt-2 text-xs space-y-1">
                  <div
                    className={`flex items-center ${
                      passwordValidation.minLength
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    <span className="mr-1">
                      {passwordValidation.minLength ? "✓" : "✗"}
                    </span>
                    At least 8 characters
                  </div>
                  <div
                    className={`flex items-center ${
                      passwordValidation.hasUpperCase
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    <span className="mr-1">
                      {passwordValidation.hasUpperCase ? "✓" : "✗"}
                    </span>
                    One uppercase letter
                  </div>
                  <div
                    className={`flex items-center ${
                      passwordValidation.hasLowerCase
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    <span className="mr-1">
                      {passwordValidation.hasLowerCase ? "✓" : "✗"}
                    </span>
                    One lowercase letter
                  </div>
                  <div
                    className={`flex items-center ${
                      passwordValidation.hasNumber
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    <span className="mr-1">
                      {passwordValidation.hasNumber ? "✓" : "✗"}
                    </span>
                    One number
                  </div>
                  <div
                    className={`flex items-center ${
                      passwordValidation.hasSpecialChar
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    <span className="mr-1">
                      {passwordValidation.hasSpecialChar ? "✓" : "✗"}
                    </span>
                    One special character
                  </div>
                </div>
              )}

              {passwordError && (
                <p className="mt-1 text-xs text-red-600">{passwordError}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#331d15] mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordError("");
                  }}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#996936] focus:border-transparent outline-none transition-all ${
                    confirmPasswordError ? "border-red-500" : "border-[#c1974e]"
                  }`}
                  placeholder="Confirm your password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-[#67412c] hover:text-[#331d15] transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="mt-1 text-xs text-red-600">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="cursor-pointer w-full bg-[#331d15] hover:bg-[#67412c] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          <div className="px-8 py-4 bg-[#e1d0a7] text-center">
            <p className="text-xs text-[#331d15]">
              Already have an account?{" "}
              <Link to="/signin">
                <button className="cursor-pointer text-[#67412c] hover:text-[#331d15] font-semibold transition-colors underline">
                  Sign In
                </button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
