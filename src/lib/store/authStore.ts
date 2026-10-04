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
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isHydrating: true,
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
        if (user) {
          import("@/store/wishlistStore").then(({ useWishlistStore }) => {
            useWishlistStore.getState().fetchFromBackend();
          });
        }
      },

      setHydrating: (hydrating: boolean) =>
        set({ isHydrating: hydrating }),

      initialize: async () => {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("nearby_access_token") ||
              localStorage.getItem("token") ||
              getAuthCookie()
            : null;

        // If there is no token anywhere, user is definitively not authenticated
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

        // Token exists — keep isHydrating: true while verifying with the server
        // to prevent premature "auth true" rendering glitches
        set({ isLoading: true, isHydrating: true });

        const attempt = async (retriesLeft: number): Promise<void> => {
          try {
            const freshUser = await authApi.fetchCurrentUser();
            // Server verified session!
            set({
              user: freshUser,
              isAuthenticated: true,
              isLoading: false,
              isHydrating: false,
            });
            // Sync saved listings from backend PostgreSQL
            import("@/store/wishlistStore").then(({ useWishlistStore }) => {
              useWishlistStore.getState().fetchFromBackend();
            });
          } catch (err: any) {
            const status = err?.response?.status;
            // 401 or 403 definitively means token has expired or is invalid
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
                isHydrating: false,
              });
              return;
            }

            // Server restarting or temporary network hiccup — retry once
            if (retriesLeft > 0) {
              await new Promise((r) => setTimeout(r, 1500));
              return attempt(retriesLeft - 1);
            }

            // Backend unreachable / offline fallback
            set({
              isLoading: false,
              isHydrating: false,
              isAuthenticated: Boolean(get().user && token),
            });
          }
        };

        await attempt(1);
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
      // Only cache user metadata for offline/optimistic display.
      // Do NOT persist isAuthenticated: true so we never render auth true before verification!
      partialize: (state) => ({
        user: state.user,
      }),
      onRehydrateStorage: () => () => {
        // Hydration from local storage complete
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
