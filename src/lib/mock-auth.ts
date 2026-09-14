 /**
 * mock-auth.ts
 * -----------
 * Lightweight in-memory auth helper for development.
 * No real database or JWT library needed — sessions are
 * signed with a simple HMAC-SHA256 using the Web Crypto API.
 *
 * NOTE: Users are lost on server restart. This is intentional
 * for dev — plug in a real DB/JWT when the backend is ready.
 */

import type { User, UserRole } from "@/types/user";

// Types

export interface StoredUser extends User {
  passwordHash: string;
}

// In-Memory Store

const store = new Map<string, StoredUser>(); // id → user
const emailIndex = new Map<string, string>(); // email → id

export const mockUserStore = {
  save(user: StoredUser) {
    store.set(user.id, user);
    emailIndex.set(user.email.toLowerCase(), user.id);
  },
  findByEmail(email: string): StoredUser | undefined {
    const id = emailIndex.get(email.toLowerCase());
    return id ? store.get(id) : undefined;
  },
  findById(id: string): StoredUser | undefined {
    return store.get(id);
  },
};

// Password hashing (SHA-256 via Web Crypto)

const PEPPER = "ne_dev_pepper_2026";

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashPassword(password: string): Promise<string> {
  return sha256(PEPPER + password);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const candidate = await sha256(PEPPER + password);
  return candidate === hash;
}

// Session tokens (HMAC-SHA256)

const SESSION_SECRET = "ne_dev_session_secret_2026";

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
  const payload = `${userId}:${Date.now()}`;
  const sig = await hmac(payload);
  return btoa(`${payload}|${sig}`);
}

export async function verifySession(token: string): Promise<string | null> {
  try {
    const decoded = atob(token);
    const lastPipe = decoded.lastIndexOf("|");
    const payload = decoded.slice(0, lastPipe);
    const sig = decoded.slice(lastPipe + 1);
    const expected = await hmac(payload);
    if (sig !== expected) return null;
    const userId = payload.split(":")[0];
    return userId || null;
  } catch {
    return null;
  }
}

// User factory

let idCounter = 1;

export async function createMockUser({
  name,
  email,
  password,
  phone,
  role,
}: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}): Promise<StoredUser> {
  const now = new Date().toISOString();
  const passwordHash = await hashPassword(password);
  const id = `mock_${Date.now()}_${idCounter++}`;

  return {
    id,
    name,
    email,
    phone: phone ?? null,
    avatar: null,
    role,
    roles: [role],
    isVerified: false,
    verificationStatus: "PENDING",
    homeCity: null,
    bio: null,
    createdAt: now,
    updatedAt: now,
    passwordHash,
  };
}
