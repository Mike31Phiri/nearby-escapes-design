import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : typeof window === "undefined"
    ? "http://127.0.0.1:3000/api"
    : "/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Automatically attach HttpOnly cookies
  timeout: 15000,
});

// Response interceptor — normalise errors and redirect on 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't violently redirect on initial session check
      const isSessionCheck = error.config?.url?.includes("/auth/me");
      if (!isSessionCheck && typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
