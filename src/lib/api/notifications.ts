import apiClient from "./client";
import type { AppNotification } from "@/store/notificationStore";

/**
 * Fetch latest notifications for the authenticated user from the backend API.
 * Unwraps NestJS `{ success: true, meta: {...}, data: [...] }` response
 * and maps participant identifiers (guestId, hostId, userId) so notifications
 * are strictly scoped to the concerned parties.
 */
export async function getNotifications(): Promise<AppNotification[]> {
  try {
    const { data } = await apiClient.get<any>("/notifications");
    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];

    return rawList.map((n: any) => ({
      id: String(n.id || `notif-${Date.now()}`),
      userId: n.userId,
      type: (n.type || "system").toLowerCase(),
      title: n.title || "Notification",
      description: n.description || "",
      timestamp: n.timestamp || n.createdAt || new Date().toISOString(),
      read: Boolean(n.read || n.isRead),
      actionUrl: n.actionUrl || undefined,
      actionLabel: n.actionLabel || "View",
      guestId: n.guestId || n.metadata?.guestId || n.metadata?.guestUserId,
      hostId: n.hostId || n.metadata?.hostId || n.metadata?.hostUserId,
      metadata: n.metadata,
    }));
  } catch {
    // If backend endpoint is not yet configured or returns error, return empty array gracefully
    return [];
  }
}

/**
 * Mark a single notification as read on the backend
 * PATCH /api/notifications/:id/read
 */
export async function markNotificationAsRead(id: string): Promise<void> {
  try {
    await apiClient.patch(`/notifications/${id}/read`);
  } catch {
    // Graceful fallback
  }
}

/**
 * Mark all notifications as read on the backend
 * POST /api/notifications/read-all
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    await apiClient.post("/notifications/read-all");
  } catch {
    // Graceful fallback
  }
}
