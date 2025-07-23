import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import bgVideo from "../../assets/video/auth_bg.mp4";

const Signin = () => {
  const navigate = useNavigate();
  const { signin, user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Clear all errors
    setEmailError("");
    setPasswordError("");

    let hasErrors = false;

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
    }

    // If there are errors, don't proceed
    if (hasErrors) return;

    setIsSubmitting(true);

    try {
      const result = await signin(email, password);

      if (!result.success) {
        if (result.error === "Invalid email or password") {
          setPasswordError("Invalid email or password");
        } else {
          setPasswordError(result.error || "Something went wrong. Try again.");
        }
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setPasswordError("Server error. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#331d15]"></div>
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
            Welcome Back to
          </p>
          <p className="text-5xl sm:text-5xl md:text-7xl lg:text-8xl   font-black text-[#331d15] ">
            Kape Kalakal
          </p>
          <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl   font-bold text-[#331d15]">
            Continue your coffee journey with us.
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
              Sign In to KapeKalakal
            </h2>
            <p className="text-[#c1974e] text-xs">
              Access your coffee journey account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
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
                autoComplete="email"
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
              {passwordError && (
                <p className="mt-1 text-xs text-red-600">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full bg-[#331d15] hover:bg-[#67412c] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="px-8 py-4 bg-[#e1d0a7] text-center">
            <p className="text-xs text-[#331d15]">
              Don't have an account?{" "}
              <Link to="/signup">
                <button className="cursor-pointer text-[#67412c] hover:text-[#331d15] font-semibold transition-colors underline">
                  Sign Up
                </button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
