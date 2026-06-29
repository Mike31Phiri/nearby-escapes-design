import { create } from "zustand";
import type { User } from "@/types/user";
import * as authApi from "../api/auth";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isHydrating: boolean;
  isAuthenticated: boolean | null; // null = checking
  setAuthenticated: (isAuth: boolean) => void;
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isHydrating: true,
  isAuthenticated: null,

  setAuthenticated: (isAuth: boolean) => set({ isAuthenticated: isAuth, isHydrating: false }),

  setUser: (user) => set({ user, isAuthenticated: !!user, isHydrating: false }),

  initialize: async () => {
    // Prevent double fetches if already loaded
    if (get().user !== null) {
      set({ isHydrating: false });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authApi.fetchCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false, isHydrating: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false, isHydrating: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false, isHydrating: false });
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
  },
}));

export const useAuth = () => {
  const store = useAuthStore();
  return {
    ...store,
    // Fallback getter if isAuthenticated is null, treat as false but we can use isHydrating to check status
    isAuthenticated: store.isAuthenticated ?? false,
  };
};
