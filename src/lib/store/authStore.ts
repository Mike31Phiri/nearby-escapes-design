import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/safeStorage";
import type { User } from "@/types/user";
import * as authApi from "../api/auth";

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

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isHydrating: false,
        }),

      setHydrating: (hydrating: boolean) =>
        set({ isHydrating: hydrating }),

      initialize: async () => {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("nearby_access_token") ||
              localStorage.getItem("token")
            : null;

        // If there's neither a cached user nor a token, mark hydrated & unauthenticated immediately
        if (!get().user && !token) {
          set({ isAuthenticated: false, isHydrating: false });
          return;
        }

        // If we already have a cached user, we can unblock rendering immediately
        if (get().user) {
          set({ isAuthenticated: true, isHydrating: false });
        }

        set({ isLoading: true });

        // Silent background revalidation / sync with server
        const attempt = async (retriesLeft: number): Promise<void> => {
          try {
            const freshUser = await authApi.fetchCurrentUser();
            set({
              user: freshUser,
              isAuthenticated: true,
              isLoading: false,
              isHydrating: false,
            });
          } catch (err: any) {
            const status = err?.response?.status;
            // 401 or 403 definitively means token has expired or is invalid
            if (status === 401 || status === 403) {
              if (typeof window !== "undefined") {
                localStorage.removeItem("nearby_access_token");
                localStorage.removeItem("token");
              }
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                isHydrating: false,
              });
              return;
            }

            // Server restarting or network hiccup — retry before giving up
            if (retriesLeft > 0) {
              await new Promise((r) => setTimeout(r, 2000));
              return attempt(retriesLeft - 1);
            }

            // Do NOT log the user out on network/connectivity issues; keep cached user
            set({
              isLoading: false,
              isHydrating: false,
              isAuthenticated: Boolean(get().user),
            });
          }
        };

        await attempt(2);
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } finally {
          if (typeof window !== "undefined") {
            localStorage.removeItem("nearby_access_token");
            localStorage.removeItem("token");
          }
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isHydrating: false,
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
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Once persisted state is rehydrated from localStorage, unblock hydration
        state?.setHydrating(false);
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
