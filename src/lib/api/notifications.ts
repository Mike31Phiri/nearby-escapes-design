import apiClient from "./client";
import type { AppNotification } from "@/store/notificationStore";

/**
 * Fetch latest notifications for the authenticated user from the backend API.
 */
export async function getNotifications(): Promise<AppNotification[]> {
  try {
    const { data } = await apiClient.get<AppNotification[]>("/notifications");
    return Array.isArray(data) ? data : [];
  } catch {
    // If backend endpoint is not yet configured or returns 404, return empty array gracefully
    return [];
  }
}
