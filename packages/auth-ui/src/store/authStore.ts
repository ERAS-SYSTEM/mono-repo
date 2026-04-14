import { create } from "zustand";
import axios from "axios";

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface ProfileUpdatePayload {
  first_name: string;
  last_name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: ProfileUpdatePayload) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, newPassword: string) => Promise<string>;
}

const API_URL = "http://localhost:8000/api";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  isLoading: false,

  login: async (username, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/auth/login/`, { username, password });
      const { user, access, refresh } = response.data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      axios.defaults.headers.common.Authorization = `Bearer ${access}`;
      set({ user, accessToken: access, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/auth/register/`, { username, email, password });
      const { user, access, refresh } = response.data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      axios.defaults.headers.common.Authorization = `Bearer ${access}`;
      set({ user, accessToken: access, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    const refresh = localStorage.getItem("refreshToken");
    try {
      await axios.post(`${API_URL}/auth/logout/`, { refresh });
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete axios.defaults.headers.common.Authorization;
    set({ user: null, accessToken: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      set({ user: null, accessToken: null });
      return;
    }

    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    try {
      const response = await axios.get(`${API_URL}/auth/me/`);
      set({ user: response.data, accessToken: token });
    } catch (_error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      delete axios.defaults.headers.common.Authorization;
      set({ user: null, accessToken: null });
    }
  },

  updateProfile: async (data) => {
    const token = get().accessToken ?? localStorage.getItem("accessToken");
    if (!token) throw new Error("Not authenticated");
    const response = await axios.put(`${API_URL}/auth/profile/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    set({ user: response.data });
  },

  changePassword: async (oldPassword, newPassword) => {
    const token = get().accessToken ?? localStorage.getItem("accessToken");
    if (!token) throw new Error("Not authenticated");
    await axios.post(
      `${API_URL}/auth/change-password/`,
      { old_password: oldPassword, new_password: newPassword },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  },

  forgotPassword: async (email) => {
    const response = await axios.post(`${API_URL}/auth/forgot-password/`, { email });
    return response.data.message ?? "If an account exists, reset link sent to email";
  },

  resetPassword: async (token, newPassword) => {
    const response = await axios.post(`${API_URL}/auth/reset-password/`, {
      token,
      new_password: newPassword,
    });
    return response.data.message ?? "Password reset successful";
  },
}));
