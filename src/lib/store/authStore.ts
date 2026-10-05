import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/safeStorage";
import type { User } from "@/types/user";
import * as authApi from "../api/auth";
import { clearAuthCookies, getAuthCookie } from "@/lib/auth/cookies";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isHydrating: boolean;
  isAuthenticated: boolean;
  setAuthenticated: (isAuth: boolean) => void;
  setUser: (user: User | null) => void;
  setHydrating: (hydrating: boolean) => void;
  initialize: () => Promise<void>;
  syncLocalSession: () => void;
  fetchProfile: () => Promise<User | null>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isHydrating: false,
      isAuthenticated: false,

      setAuthenticated: (isAuth: boolean) =>
        set({ isAuthenticated: isAuth, isHydrating: false }),

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          isHydrating: false,
          isLoading: false,
        });
      },

      setHydrating: (hydrating: boolean) =>
        set({ isHydrating: hydrating }),

      syncLocalSession: () => {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("nearby_access_token") ||
              localStorage.getItem("token") ||
              getAuthCookie()
            : null;

        if (!token) {
          clearAuthCookies();
          set({
            user: null,
            isAuthenticated: false,
            isHydrating: false,
            isLoading: false,
          });
          return;
        }

        // Token exists — stay authenticated immediately with zero blocking network delay
        set({
          isAuthenticated: true,
          isHydrating: false,
          isLoading: false,
        });
      },

      initialize: async () => {
        get().syncLocalSession();
      },

      /** On-demand fetch of current user from /auth/me (triggered when clicking profile or visiting profile page) */
      fetchProfile: async () => {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("nearby_access_token") ||
              localStorage.getItem("token") ||
              getAuthCookie()
            : null;

        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return null;
        }

        set({ isLoading: true });
        try {
          const freshUser = await authApi.fetchCurrentUser();
          set({
            user: freshUser,
            isAuthenticated: true,
            isLoading: false,
          });
          return freshUser;
        } catch (err: any) {
          const status = err?.response?.status;
          if (status === 401 || status === 403) {
            if (typeof window !== "undefined") {
              localStorage.removeItem("nearby_access_token");
              localStorage.removeItem("token");
              clearAuthCookies();
            }
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
          return null;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } finally {
          if (typeof window !== "undefined") {
            localStorage.removeItem("nearby_access_token");
            localStorage.removeItem("token");
            clearAuthCookies();
          }
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isHydrating: false,
          });
          import("@/store/wishlistStore").then(({ useWishlistStore }) => {
            useWishlistStore.getState().clearWishlist();
          });
          if (typeof window !== "undefined") {
            window.location.href = "/auth/login";
          }
        }
      },
    }),
    {
      name: "nearby_auth_store",
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: !!state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          state.isAuthenticated = true;
          state.isHydrating = false;
        }
      },
    },
  ),
);

export const useAuth = () => {
  const store = useAuthStore();
  return {
    ...store,
    isAuthenticated: store.isAuthenticated,
  };
};
