/**
 * users.ts — Users / profile API stubs
 *
 * TODO: Connect to real API
 */

import apiClient from "./client";

export interface UserProfileDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: "guest" | "host" | "admin";
  homeCity?: string;
  bio?: string;
  joinedAt: string;
  stats: {
    totalBookings: number;
    totalReviews: number;
    memberSince: string;
  };
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  avatar?: string;
  homeCity?: string;
  bio?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

/** Fetch the authenticated user's profile. */
// TODO: Connect to real API
export const getMyProfile = async (): Promise<UserProfileDTO> => {
  void apiClient;
  return {} as UserProfileDTO;
};

/** Update the authenticated user's profile fields. */
// TODO: Connect to real API
export const updateMyProfile = async (payload: UpdateProfilePayload): Promise<UserProfileDTO> => {
  void apiClient;
  void payload;
  return {} as UserProfileDTO;
};

/** Change password for the authenticated user. */
// TODO: Connect to real API
export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<{ success: boolean }> => {
  void apiClient;
  void payload;
  return { success: true };
};

/** Upload a new avatar image — returns the public URL. */
// TODO: Connect to real API
export const uploadAvatar = async (file: File): Promise<{ avatarUrl: string }> => {
  void apiClient;
  void file;
  return { avatarUrl: "" };
};

/** Delete the authenticated user's account. */
// TODO: Connect to real API
export const deleteMyAccount = async (): Promise<{ success: boolean }> => {
  void apiClient;
  return { success: true };
};
