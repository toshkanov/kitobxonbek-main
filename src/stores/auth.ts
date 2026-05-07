"use client";

import { create } from "zustand";
import type { UserResponse } from "@/lib/api/auth";
import { login as loginApi, register as registerApi, logout as logoutApi, getMe } from "@/lib/api/auth";
import { setAuthTokens, clearAuthTokens } from "@/lib/api";
import { toast } from "sonner";

interface AuthState {
  user: UserResponse | null;
  isLoading: boolean;
  setUser: (user: UserResponse | null) => void;
  setLoading: (loading: boolean) => void;
  login: (data: { email?: string; phone?: string; password: string }) => Promise<void>;
  register: (data: { email: string; phone: string; first_name: string; last_name: string; password: string; password_confirm: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),

  login: async (data) => {
    set({ isLoading: true });
    try {
      const response = await loginApi(data);
      setAuthTokens(response.access, response.refresh);
      set({ user: response.user });
      toast.success("Muvaffaqiyatli kirdingiz");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error ?? "Kirishda xatolik yuz berdi");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const response = await registerApi(data);
      toast.success("Ro'yxatdan o'tildi. OTP kod yuborildi.");
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error ?? "Ro'yxatdan o'tishda xatolik yuz berdi");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      const refreshToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("refresh_token="))
        ?.split("=")[1];
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch {
      // ignore
    }
    clearAuthTokens();
    set({ user: null });
    toast.success("Chiqildi");
  },

  fetchProfile: async () => {
    try {
      const user = await getMe();
      set({ user });
    } catch {
      // ignore - user not authenticated
    }
  },

  clear: () => {
    clearAuthTokens();
    set({ user: null });
  },
}));
