/**
 * users.ts — Users & Profile API Service
 *
 * Directly connects to the backend /users and /users/profile endpoints.
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

/** Upload a new avatar image to the server — returns the updated avatar URL. */
export const uploadAvatar = async (file: File): Promise<{ avatarUrl: string }> => {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await apiClient.post<{ avatar?: string; [key: string]: any }>(
    "/users/profile/avatar",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return { avatarUrl: data.avatar || "" };
};

/** Delete the authenticated user's account. */
export const deleteMyAccount = async (): Promise<{ success: boolean }> => {
  const { data } = await apiClient.delete<{ success: boolean }>("/users/profile");
  return data;
};
