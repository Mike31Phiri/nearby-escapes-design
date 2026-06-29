/**
 * Role-based access guard functions for Nearby Escapes.
 *
 * These are pure functions — they contain no side-effects and can be used
 * safely in both client and server contexts (middleware, RSC, API routes).
 *
 * Roles are stored as an array on the User object to support multi-role
 * accounts (e.g. a host who is also a guest).
 */

import type { User } from "@/types/user";

/** Returns true if the user is authenticated and has the 'guest' role. */
export const isGuest = (user: User | null): boolean => !!user && user.roles.includes("guest");

/** Returns true if the user is authenticated and has the 'host' role. */
export const isHost = (user: User | null): boolean => !!user && user.roles.includes("host");

/** Returns true if the user is authenticated and has the 'admin' role. */
export const isAdmin = (user: User | null): boolean => !!user && user.roles.includes("admin");

/**
 * Returns true if the user is an admin AND the associated admin profile
 * has Super Admin privileges.
 *
 * Use this to gate access to sensitive sections such as:
 * - Finance reports & payouts
 * - Team/settings management
 * - Package creation
 */
export const isSuperAdmin = (
  user: User | null,
  adminProfile: { isSuperAdmin: boolean } | null,
): boolean => isAdmin(user) && !!adminProfile?.isSuperAdmin;

/** Alias: guests can initiate bookings. */
export const canBook = (user: User | null): boolean => isGuest(user);

/** Alias: hosts can create and manage listings. */
export const canList = (user: User | null): boolean => isHost(user);

/** Alias: admins can access the admin portal. */
export const canAccessAdmin = (user: User | null): boolean => isAdmin(user);
