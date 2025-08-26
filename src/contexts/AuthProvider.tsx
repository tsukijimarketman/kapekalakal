import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS, fetchWithCredentials } from "../config/api";
import { AuthContext } from "./AuthContext";
import type { User } from "../types/auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      // Skip auth check if we're on the signin/signup pages
      if (['/signin', '/signup'].includes(window.location.pathname)) {
        setLoading(false);
        return;
      }

      const response = await fetchWithCredentials(API_ENDPOINTS.AUTH.VERIFY);

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Only redirect if we're not already on the signin page
        if (!['/signin', '/signup'].includes(window.location.pathname)) {
          window.location.href = '/signin';
        }
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const signin = async (email: string, password: string) => {
    try {
      const response = await fetchWithCredentials(API_ENDPOINTS.AUTH.SIGNIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: 'Invalid email or password' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An error occurred during sign in' };
    }
  };

  const signout = async () => {
    try {
      await fetchWithCredentials(API_ENDPOINTS.AUTH.SIGNOUT, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setUser(null);
      window.location.href = '/signin';
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    user,
    loading,
    signin,
    signout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
