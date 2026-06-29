export type UserRole = "guest" | "host" | "admin";

/**
 * Matches the shape returned by auth.service.ts sanitize()
 * - role: lowercase single string e.g. 'guest'
 * - roles: array e.g. ['guest'] (added by sanitize for frontend compatibility)
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  /** Single role string from DB e.g. 'guest' | 'host' | 'admin' */
  role: UserRole;
  /** Array form for convenience: always [role] */
  roles: UserRole[];
  isVerified: boolean;
  verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED";
  homeCity?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GuestProfile {
  userId: string;
  loyaltyPoints: number;
  savedListingIds: string[];
  totalTrips: number;
}

export interface HostProfile {
  userId: string;
  businessName?: string;
  bio?: string;
  kycStatus: "pending" | "approved" | "rejected";
  payoutMethod?: string;
  bankAccountNumber?: string;
  rating: number;
  totalReviews: number;
  totalListings: number;
  responseRate: number; // 0–100
  memberSince: string;
}

export interface AdminProfile {
  userId: string;
  isSuperAdmin: boolean;
  permissions: string[];
  lastLogin: string;
}
