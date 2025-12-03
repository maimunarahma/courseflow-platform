

import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (formData: RegisterPayload) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  error: any;
}

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load logged in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/user/me`,
          {  withCredentials: true }
        );

        const userData = res.data?.data;

        setUser(userData || null);
        setIsAuthenticated(!!userData);

        queryClient.setQueryData(['auth-user'], userData || null);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [queryClient]);

  // Register
  const register = async (formData: RegisterPayload) => {
    setLoading(true);
    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/user/register`,
        formData,
        { withCredentials: true }
      );

      const userData = res.data.data;
      setUser(userData);
      setIsAuthenticated(true);
   setLoading(false);
      queryClient.setQueryData(['auth-user'], userData);
      toast("Account created!", {
        description: "Welcome to CourseMaster!",
      });
    } catch (err: any) {
      setError(err);
      toast("Registration failed", {
        description: err?.response?.data?.message ?? err.message,
        style: { background: "red", color: "white" },
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth`,
        { email, password },
        { withCredentials: true }
      );

      const userData = res.data.data;
      setUser(userData);
      setIsAuthenticated(true);

      queryClient.setQueryData(['auth-user'], userData);
      toast("Welcome back!", { description: "Login successful." });
    } catch (err) {
      toast("Login failed", { description: "Invalid credentials" });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );
    setUser(null);
    setIsAuthenticated(false);
    queryClient.setQueryData(['auth-user'], null);
    toast("Logged out");
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading,
      isAuthenticated,
      setUser,
      error,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}