import axios, { AxiosError } from "axios";
import { clearAuthCookies } from "@/lib/auth/cookies";

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://01a100f6-3a8a-7cc3-9776-12e246c72bef-3000.eur-1.aiven.app"
).replace(/\/+$/, "");

// Direct backend URL for all requests (browser and server)
const API_BASE_URL = `${API_ORIGIN}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Automatically attach HttpOnly cookies
  timeout: 15000,
  validateStatus: (status) => (status >= 200 && status < 300) || status === 304,
});

// Request interceptor — attach Bearer token if stored in client storage
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("nearby_access_token") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("nearby_access_token");
    if (token && config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Prevent browser caching on auth endpoints
  if (config.url?.includes("/auth/")) {
    config.headers = config.headers || {};
    config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    config.headers["Pragma"] = "no-cache";
  }

  return config;
});

// ── Session verification ─────────────────────────────────────────────
// A single 401 from one endpoint (e.g. a host-only route, a background
// refetch) must NOT log the user out. We only end the session when
// /auth/me itself confirms the token is no longer valid.
let sessionCheck: Promise<boolean> | null = null;

function isSessionStillValid(): Promise<boolean> {
  if (!sessionCheck) {
    sessionCheck = apiClient
      .get("/auth/me")
      .then(() => true)
      // Network errors / backend restarting (no response) ≠ logged out
      .catch((err: AxiosError) => err.response?.status !== 401)
      .finally(() => {
        // De-duplicate concurrent 401s, then allow fresh checks later
        setTimeout(() => {
          sessionCheck = null;
        }, 5000);
      });
  }
  return sessionCheck;
}

const PROTECTED_ROUTE_PREFIXES = ["/profile", "/settings", "/host", "/admin", "/trips"];

async function endSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("nearby_access_token");
  localStorage.removeItem("token");
  clearAuthCookies();

  // Clear auth state without a circular import at module load
  const { useAuthStore } = await import("@/lib/store/authStore");
  useAuthStore.getState().setUser(null);

  const { pathname, search } = window.location;
  const isProtected = PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtected && !pathname.startsWith("/auth")) {
    window.location.href = `/auth/login?next=${encodeURIComponent(pathname + search)}`;
  }
}

// Response interceptor — only end the session on a confirmed expiry
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string | string[]; error?: string; statusCode?: number }>) => {
    const url = error.config?.url ?? "";
    const isAuthEndpoint =
      url.includes("/auth/me") ||
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/logout");

    if (error.response?.status === 401 && !isAuthEndpoint && typeof window !== "undefined") {
      const stillValid = await isSessionStillValid();
      if (!stillValid) await endSession();
    }
    return Promise.reject(error);
  },
);

/**
 * Utility to extract clean error message from API response
 */
export function getApiErrorMessage(error: unknown, fallback = "An unexpected error occurred"): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join(", ") : data.message;
    }
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export default apiClient;

