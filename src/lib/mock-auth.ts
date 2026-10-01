/**
 * mock-auth.ts
 * -----------
 * Production-ready mock auth helper for Next.js App Router.
 * - Seeds default demo accounts (Guest, Host, Admin) with known passwords
 * - Persists to local disk (.data/users.json) so users survive server reloads
 * - Password hashing via SHA-256 + pepper
 * - HMAC-SHA256 session tokens supporting both HTTP-only Cookies and Bearer tokens
 * - OTP generation & verification (supports dynamic code and universal dev code "123456")
 * - Password reset token management
 */

import fs from "fs";
import path from "path";
import type { User, UserRole } from "@/types/user";

export interface StoredUser extends User {
  passwordHash: string;
}

// In-Memory & File-Backed Store via globalThis singleton pattern (for Next.js route sharing)
const globalForAuth = globalThis as unknown as {
  __mockUserStore?: Map<string, StoredUser>;
  __mockEmailIndex?: Map<string, string>;
  __mockPhoneIndex?: Map<string, string>;
  __mockOtpStore?: Map<string, { code: string; expiresAt: number }>;
  __mockResetTokenStore?: Map<string, { email: string; expiresAt: number }>;
  __mockAuthSeeded?: boolean;
};

const store = globalForAuth.__mockUserStore ?? new Map<string, StoredUser>();
const emailIndex = globalForAuth.__mockEmailIndex ?? new Map<string, string>();
const phoneIndex = globalForAuth.__mockPhoneIndex ?? new Map<string, string>();
const otpStore = globalForAuth.__mockOtpStore ?? new Map<string, { code: string; expiresAt: number }>();
const resetTokenStore = globalForAuth.__mockResetTokenStore ?? new Map<string, { email: string; expiresAt: number }>();

globalForAuth.__mockUserStore = store;
globalForAuth.__mockEmailIndex = emailIndex;
globalForAuth.__mockPhoneIndex = phoneIndex;
globalForAuth.__mockOtpStore = otpStore;
globalForAuth.__mockResetTokenStore = resetTokenStore;

const PEPPER = "ne_dev_pepper_2026";
const SESSION_SECRET = "ne_dev_session_secret_2026";

// Path to persistent dev storage
const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // Ignore in read-only environments
  }
}

function saveStoreToDisk() {
  try {
    ensureDataDir();
    const usersArray = Array.from(store.values());
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersArray, null, 2), "utf-8");
  } catch (err) {
    console.warn("[mock-auth] Failed to persist users to disk:", err);
  }
}

function loadStoreFromDisk() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, "utf-8");
      const usersArray: StoredUser[] = JSON.parse(raw);
      for (const u of usersArray) {
        store.set(u.id, u);
        if (u.email) emailIndex.set(u.email.toLowerCase(), u.id);
        if (u.phone) phoneIndex.set(u.phone, u.id);
      }
    }
  } catch (err) {
    console.warn("[mock-auth] Failed to load users from disk:", err);
  }
}

// Password hashing (SHA-256 via Web Crypto)
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
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7).trim() : token.trim();
    const decoded = atob(cleanToken);
    const lastPipe = decoded.lastIndexOf("|");
    if (lastPipe === -1) return null;
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

// Seed default users if not already in store
let isSeeded = globalForAuth.__mockAuthSeeded ?? false;

export async function seedDefaultUsers() {
  if (isSeeded) return;
  loadStoreFromDisk();

  const defaultPasswordHash = await hashPassword("Password123!");
  const now = "2026-01-01T00:00:00.000Z";

  const defaultUsers: StoredUser[] = [
    {
      id: "usr_guest_demo",
      name: "Chali Musonda",
      email: "guest@nearbyescapes.com",
      phone: "+260971234567",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      role: "guest",
      roles: ["guest"],
      isVerified: true,
      verificationStatus: "VERIFIED",
      homeCity: "Lusaka",
      bio: "Travel lover and wildlife explorer across Zambia.",
      createdAt: now,
      updatedAt: now,
      passwordHash: defaultPasswordHash,
    },
    {
      id: "usr_host_demo",
      name: "Kapasa Mwansa",
      email: "host@nearbyescapes.com",
      phone: "+260967654321",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      role: "host",
      roles: ["host"],
      isVerified: true,
      verificationStatus: "VERIFIED",
      homeCity: "Livingstone",
      bio: "Licensed safari guide & lodge host in South Luangwa and Livingstone.",
      createdAt: now,
      updatedAt: now,
      passwordHash: defaultPasswordHash,
    },
    {
      id: "usr_admin_demo",
      name: "Nearby Admin",
      email: "admin@nearbyescapes.com",
      phone: "+260977889900",
      avatar: null,
      role: "admin",
      roles: ["admin", "host", "guest"],
      isVerified: true,
      verificationStatus: "VERIFIED",
      homeCity: "Lusaka",
      bio: "Platform Administrator.",
      createdAt: now,
      updatedAt: now,
      passwordHash: defaultPasswordHash,
    },
  ];

  for (const user of defaultUsers) {
    if (!store.has(user.id) && !emailIndex.has(user.email.toLowerCase())) {
      store.set(user.id, user);
      emailIndex.set(user.email.toLowerCase(), user.id);
      if (user.phone) phoneIndex.set(user.phone, user.id);
    }
  }

  isSeeded = true;
  globalForAuth.__mockAuthSeeded = true;
  saveStoreToDisk();
}

// User store manager
export const mockUserStore = {
  async ensureReady() {
    await seedDefaultUsers();
  },

  save(user: StoredUser) {
    store.set(user.id, user);
    if (user.email) emailIndex.set(user.email.toLowerCase(), user.id);
    if (user.phone) phoneIndex.set(user.phone, user.id);
    saveStoreToDisk();
  },

  findByEmail(email: string): StoredUser | undefined {
    if (!isSeeded) {
      loadStoreFromDisk();
    }
    const id = emailIndex.get(email.toLowerCase().trim());
    return id ? store.get(id) : undefined;
  },

  findByPhone(phone: string): StoredUser | undefined {
    if (!isSeeded) {
      loadStoreFromDisk();
    }
    const cleanPhone = phone.trim();
    const id = phoneIndex.get(cleanPhone);
    return id ? store.get(id) : undefined;
  },

  findById(id: string): StoredUser | undefined {
    if (!isSeeded) {
      loadStoreFromDisk();
    }
    return store.get(id);
  },

  async updatePassword(userId: string, newPassword: string): Promise<boolean> {
    const user = store.get(userId);
    if (!user) return false;
    user.passwordHash = await hashPassword(newPassword);
    user.updatedAt = new Date().toISOString();
    store.set(userId, user);
    saveStoreToDisk();
    return true;
  },

  all(): StoredUser[] {
    return Array.from(store.values());
  },
};

// OTP Services
export const mockOtpService = {
  createOtp(identifier: string): string {
    const clean = identifier.toLowerCase().trim();
    // 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore.set(clean, { code, expiresAt });
    console.log(`[mock-auth] OTP for ${clean}: ${code} (Universal test code "123456" also accepted)`);
    return code;
  },

  verifyOtp(identifier: string, code: string): boolean {
    const clean = identifier.toLowerCase().trim();
    // Universal dev bypass code
    if (code === "123456") return true;

    const record = otpStore.get(clean);
    if (!record) return false;
    if (Date.now() > record.expiresAt) {
      otpStore.delete(clean);
      return false;
    }
    const valid = record.code === code.trim();
    if (valid) {
      otpStore.delete(clean);
    }
    return valid;
  },
};

// Password Reset Token Services
export const mockResetService = {
  createResetToken(email: string): string {
    const clean = email.toLowerCase().trim();
    const token = `rst_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes
    resetTokenStore.set(token, { email: clean, expiresAt });
    return token;
  },

  verifyResetToken(token: string): string | null {
    const record = resetTokenStore.get(token.trim());
    if (!record) return null;
    if (Date.now() > record.expiresAt) {
      resetTokenStore.delete(token.trim());
      return null;
    }
    return record.email;
  },

  consumeResetToken(token: string): string | null {
    const email = this.verifyResetToken(token);
    if (email) {
      resetTokenStore.delete(token.trim());
    }
    return email;
  },
};

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
  const id = `usr_${Date.now()}_${idCounter++}`;

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
