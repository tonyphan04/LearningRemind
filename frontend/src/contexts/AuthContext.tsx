import React, { useState, useEffect } from "react";
import {
  getToken,
  setToken as setTokenUtil,
  removeToken,
} from "../utils/token";
import { AuthContext } from "./AuthContext.types";

/**
 * Provider component that wraps your app and makes auth object available to any
 * child component that calls useAuth().
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for token on initial load and when token changes
  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      setIsAuthenticated(!!token);
      setLoading(false);
    };

    checkAuth();

    // Listen for storage events to handle token changes in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Login: store token and update state
  const login = (token: string) => {
    setTokenUtil(token);
    setIsAuthenticated(true);
  };

  // Logout: remove token and update state
  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  // Make the context object
  const value = {
    isAuthenticated,
    login,
    logout,
    loading,
  };

  // Provider component that makes auth object available to children
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook is now in a separate file: src/hooks/useAuthContext.ts
