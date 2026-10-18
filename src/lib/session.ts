/**
 * session.ts
 * ----------
 * HMAC-SHA256 session token helpers. Uses only Web APIs so it is safe to
 * import from Edge Runtime code such as middleware.
 */

const SESSION_SECRET = "ne_dev_session_secret_2026";

// Session tokens (HMAC-SHA256)
// Token format: base64(`${userId}:${issuedAt}:${expiresAt}|${signature}`)
const ABSOLUTE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days absolute max

async function hmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export async function signSession(userId: string): Promise<string> {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + (ABSOLUTE_MAX_AGE_SECONDS * 1000);
  const payload = `${userId}:${issuedAt}:${expiresAt}`;
  const sig = await hmac(payload);
  return btoa(`${payload}|${sig}`);
}

export async function verifySession(token: string): Promise<string | null> {
  try {
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7).trim() : token.trim();
    const decoded = atob(cleanToken);
    const lastPipe = decoded.lastIndexOf("|");
    if (lastPipe === -1) return null;
    const payload = decoded.slice(0, lastPipe);
    const sig = decoded.slice(lastPipe + 1);
    const expected = await hmac(payload);
    if (sig !== expected) return null;
    
    const parts = payload.split(":");
    if (parts.length !== 3) return null;
    
    const userId = parts[0];
    const issuedAt = parseInt(parts[1], 10);
    const expiresAt = parseInt(parts[2], 10);
    
    // Check if token has absolutely expired
    if (Date.now() > expiresAt) {
      return null;
    }
    
    return userId || null;
  } catch {
    return null;
  }
}
