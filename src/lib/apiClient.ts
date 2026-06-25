"use client";

/**
 * Centralized API Client
 *
 * Wraps fetch with:
 * - Base URL from environment
 * - Credentials (cookies) sent by default
 * - 401 → automatic logout + redirect to login
 * - 403 → redirect to forbidden page
 * - Error sanitization (strip stack traces in production)
 * - CSRF token attachment (when backend provides one)
 * - Request/response type safety
 *
 * Usage:
 *   import { api } from "@/lib/apiClient";
 *   const listings = await api.get<Listing[]>("/listings");
 *   const newBooking = await api.post<Booking>("/bookings", body);
 */

//Types ────────────────────────────────────────────────────────────────

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  ok: boolean;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestConfig {
  /** Request body (automatically JSON-stringified) */
  body?: unknown;
  /** Additional headers to merge */
  headers?: Record<string, string>;
  /** AbortSignal for cancellation */
  signal?: AbortSignal;
  /** Override the default base URL */
  baseUrl?: string;
  /** Skip CSRF token attachment */
  skipCsrf?: boolean;
  /** Don't throw on 401/403 (handle manually) */
  quiet?: boolean;
}

//Configuration ────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

//Internal State (non-reactive, for coordination) ──────────────────────

let isLoggingOut = false;
let logoutCallbacks: Array<() => void> = [];

function triggerLogout() {
  if (isLoggingOut) return;
  isLoggingOut = true;

  // Notify all registered callbacks (zustand stores clear local state)
  logoutCallbacks.forEach((cb) => cb());
  logoutCallbacks = [];

  // Redirect to login — React tree unmounts, in-memory context is lost
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    if (!currentPath.startsWith("/auth/")) {
      window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
    }
  }
}

/**
 * Register a callback that fires when the session expires.
 * Useful for zustand stores that need to clear client-side state.
 */
export function onSessionExpired(callback: () => void) {
  logoutCallbacks.push(callback);
  return () => {
    logoutCallbacks = logoutCallbacks.filter((cb) => cb !== callback);
  };
}

//CSRF Token ───────────────────────────────────────────────────────────

let csrfToken: string | null = null;

function extractCsrfFromResponse(response: Response) {
  const token = response.headers.get("x-csrf-token");
  if (token) csrfToken = token;
}

//Core Request Function ────────────────────────────────────────────────

async function request<T>(
  method: HttpMethod,
  path: string,
  config: RequestConfig = {},
): Promise<ApiResponse<T>> {
  const { body, headers: extraHeaders, signal, baseUrl, skipCsrf, quiet } = config;

  // Build URL
  const base = baseUrl || BASE_URL;
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  // Build headers
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...extraHeaders,
  };

  // Don't set Content-Type for FormData — browser sets it with multipart boundary
  if (body !== undefined && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Don't JSON-stringify FormData — pass it as-is to fetch
  const serializedBody =
    body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined;

  // Attach CSRF token for state-changing requests (if available)
  if (!skipCsrf && csrfToken && method !== "GET") {
    headers["X-CSRF-Token"] = csrfToken;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: serializedBody,
      signal,
      credentials: "include", // Send cookies (httpOnly JWT)
    });

    // Extract CSRF token from response
    extractCsrfFromResponse(response);

    // Handle 401 — session expired
    if (response.status === 401 && !quiet) {
      triggerLogout();
      return {
        data: null,
        error: {
          status: 401,
          code: "SESSION_EXPIRED",
          message: "Your session has expired. Please log in again.",
        },
        ok: false,
      };
    }

    // Handle 403 — forbidden
    if (response.status === 403 && !quiet) {
      if (typeof window !== "undefined") {
        window.location.href = "/not-found";
      }
      return {
        data: null,
        error: {
          status: 403,
          code: "FORBIDDEN",
          message: "You don't have permission to perform this action.",
        },
        ok: false,
      };
    }

    // Handle 204 No Content (success, no body)
    if (response.status === 204) {
      return { data: null as T, error: null, ok: true };
    }

    // Try to parse JSON body
    const json = await response.json().catch(() => null);

    if (!response.ok) {
      // Sanitize: strip stack traces and internal paths in production
      const rawError = json?.error || json || {};
      const sanitized: ApiError = {
        status: response.status,
        code: rawError.code || "UNKNOWN_ERROR",
        message: IS_PRODUCTION
          ? sanitizeMessage(rawError.message)
          : rawError.message || "An unexpected error occurred.",
        details: rawError.details || undefined,
      };
      return { data: null, error: sanitized, ok: false };
    }

    return { data: json as T, error: null, ok: true };
  } catch (err) {
    // Network errors, timeouts, etc.
    const message =
      err instanceof TypeError
        ? "Network error. Please check your connection and try again."
        : err instanceof Error
          ? IS_PRODUCTION
            ? "An unexpected error occurred."
            : err.message
          : "An unexpected error occurred.";

    return {
      data: null,
      error: { status: 0, code: "NETWORK_ERROR", message },
      ok: false,
    };
  }
}

/**
 * Sanitize error messages in production to avoid leaking internal details.
 */
function sanitizeMessage(message: string): string {
  // Remove anything that looks like a file path or stack frame
  const cleaned = message.replace(/\([^)]+:\d+:\d+\)/g, "").replace(/at\s+\S+\s+\(.*?\)/g, "");
  // Truncate if suspiciously long
  return cleaned.length > 200
    ? "An unexpected error occurred."
    : cleaned.trim() || "An unexpected error occurred.";
}

//Public API ───────────────────────────────────────────────────────────

export const api = {
  get<T>(path: string, config?: Omit<RequestConfig, "body">) {
    return request<T>("GET", path, config);
  },

  post<T>(path: string, body?: unknown, config?: Omit<RequestConfig, "body">) {
    return request<T>("POST", path, { ...config, body });
  },

  put<T>(path: string, body?: unknown, config?: Omit<RequestConfig, "body">) {
    return request<T>("PUT", path, { ...config, body });
  },

  patch<T>(path: string, body?: unknown, config?: Omit<RequestConfig, "body">) {
    return request<T>("PATCH", path, { ...config, body });
  },

  delete<T>(path: string, config?: Omit<RequestConfig, "body">) {
    return request<T>("DELETE", path, config);
  },

  /**
   * Upload files via FormData (multipart).
   * Content-Type is set automatically by the browser (with boundary).
   */
  upload<T>(path: string, formData: FormData, config?: Omit<RequestConfig, "body">) {
    const { headers, ...rest } = config || {};
    return request<T>("POST", path, {
      ...rest,
      body: formData,
      headers: { ...headers }, // Don't set Content-Type — browser sets it with boundary
    });
  },

  /**
   * Manually reset CSRF token (e.g. after logout).
   */
  resetCsrfToken() {
    csrfToken = null;
  },
};

//SSR-safe helpers ─────────────────────────────────────────────────────

/**
 * Server-side API call (in Next.js Server Components / Route Handlers).
 * Does NOT include credentials or CSRF — use for public data fetching.
 */
export async function serverFetch<T>(
  path: string,
  options?: { baseUrl?: string; revalidate?: number },
) {
  const base =
    options?.baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    next: { revalidate: options?.revalidate ?? 60 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok)
    return {
      data: null,
      error: { status: res.status, message: res.statusText } as ApiError,
      ok: false as const,
    };
  const data = (await res.json()) as T;
  return { data, error: null, ok: true as const };
}

//Export default for convenience ───────────────────────────────────────

export default api;
