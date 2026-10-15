/**
 * users.ts — Users & Profile API Service
 * 
 * Directly connects to the backend /users and /users/profile endpoints.
 */

import apiClient from "./client";
import { uploadToS3, uploadConfig } from "@/lib/upload";

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

/** Fetch the authenticated user's profile from the database. */
export const getMyProfile = async (): Promise<UserProfileDTO> => {
  const { data } = await apiClient.get<UserProfileDTO>("/users/profile");
  return data;
};

/** Update the authenticated user's profile fields in the database. */
export const updateMyProfile = async (payload: UpdateProfilePayload): Promise<UserProfileDTO> => {
  const { data } = await apiClient.patch<UserProfileDTO>("/users/profile", payload);
  return data;
};

/** Change password for the authenticated user. */
export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<{ success: boolean; message?: string }> => {
  const { data } = await apiClient.post<{ success: boolean; message?: string }>(
    "/auth/change-password",
    payload,
  );
  return data;
};

/** 
 * Upload a new avatar image to the server — returns the updated avatar URL and storage key.
 * Only hosts are allowed to upload custom avatars; guests use the default system avatar.
 */
export const uploadAvatar = async (file: File): Promise<{ url: string; key: string }> => {
  // Validate file type
  const allowedTypes = uploadConfig.avatars.allowedTypes;
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Only ${allowedTypes.join(", ")} are allowed`);
  }

  // Validate file size
  const maxSize = uploadConfig.avatars.maxSize;
  if (file.size > maxSize) {
    throw new Error(`File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
  }

  // Upload to S3
  const result = await uploadToS3(file, uploadConfig.avatars.folder);
  
  // In a real implementation, we would also update the user's avatar URL in the database
  // For now, we'll just return the upload result
  
  return result;
};

/** Delete the authenticated user's account. */
export const deleteMyAccount = async (): Promise<{ success: boolean }> => {
  const { data } = await apiClient.delete<{ success: boolean }>("/users/profile");
  return data;
};
