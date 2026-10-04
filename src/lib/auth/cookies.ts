/**
 * Utility functions for managing client-side authentication cookies.
 * Synchronizes auth tokens with Next.js middleware and server-side components.
 */

const AUTH_COOKIE_NAMES = ["access_token", "ne_session", "nearby_access_token"] as const;

/**
 * Sets auth cookies in document.cookie so Next.js middleware can inspect them.
 */
export function setAuthCookies(token: string, maxAgeSeconds: number = 60 * 60 * 24 * 7): void {
  if (typeof document === "undefined" || !token) return;

  const encodedToken = encodeURIComponent(token.trim());
  AUTH_COOKIE_NAMES.forEach((name) => {
    document.cookie = `${name}=${encodedToken}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
  });
}

/**
 * Clears all auth cookies upon logout or session invalidation.
 */
export function clearAuthCookies(): void {
  if (typeof document === "undefined") return;

  AUTH_COOKIE_NAMES.forEach((name) => {
    document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  });
}

/**
 * Reads the current auth token from document.cookie if available.
 */
export function getAuthCookie(): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [rawName, rawValue] = cookie.trim().split("=");
    if (rawName && AUTH_COOKIE_NAMES.includes(rawName as any) && rawValue) {
      try {
        const decoded = decodeURIComponent(rawValue);
        if (decoded) return decoded;
      } catch {
        return rawValue;
      }
    }
  }
  return null;
}
