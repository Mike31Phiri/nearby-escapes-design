import axios, { AxiosError } from "axios";

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
  return config;
});

// Response interceptor — normalise errors and redirect on 401
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[]; error?: string; statusCode?: number }>) => {
    if (error.response?.status === 401) {
      // Don't violently redirect on initial session check
      const isSessionCheck = error.config?.url?.includes("/auth/me");
      if (!isSessionCheck && typeof window !== "undefined") {
        localStorage.removeItem("nearby_access_token");
        window.location.href = "/auth/login";
      }
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

