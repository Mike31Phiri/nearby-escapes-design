"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/safeStorage";

export type NotificationType =
  | "booking_confirmed"
  | "booking_cancelled"
  | "booking_request"
  | "review_received"
  | "message"
  | "system"
  | "listing_approved"
  | "listing_rejected"
  | "payout"
  | "promotion";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const mockNotifications: AppNotification[] = [
  {
    id: "n1",
    type: "message",
    title: "New message from Grace Mwale",
    description: "Grace Mwale inquired about availability for tomorrow's sunset river cruise.",
    timestamp: "2026-06-22T15:30:00Z",
    read: false,
  },
  {
    id: "n2",
    type: "booking_request",
    title: "New booking request received",
    description: "Sarah Phiri requested to book Luxury Safari Lodge for Jun 25–Jun 29.",
    timestamp: "2026-06-20T10:30:00Z",
    read: false,
  },
  {
    id: "n3",
    type: "booking_request",
    title: "New tour reservation submitted",
    description: "James Banda submitted a reservation for the Victoria Falls Helicopter Tour on Jun 28.",
    timestamp: "2026-06-21T14:15:00Z",
    read: false,
  },
  {
    id: "n4",
    type: "booking_request",
    title: "Booking request received",
    description: "Emily Zulu submitted a booking request for Kafue River Lodge for Jun 24–Jun 29.",
    timestamp: "2026-06-19T09:45:00Z",
    read: false,
  },
  {
    id: "n5",
    type: "system",
    title: "Guest checked out",
    description: "Chisala Banda and party completed their check-out at Kafue River Lodge.",
    timestamp: "2026-06-22T10:00:00Z",
    read: false,
  },
  {
    id: "n6",
    type: "review_received",
    title: "New 5-star review received",
    description: 'David Mulenga rated Victoria Falls Helicopter Tour 5 stars: "Incredible experience — the views of the falls were breathtaking!"',
    timestamp: "2026-06-21T18:00:00Z",
    read: false,
  },
  {
    id: "n7",
    type: "system",
    title: "Tour completed",
    description: "David Mulenga completed the Victoria Falls Helicopter Tour.",
    timestamp: "2026-06-22T08:00:00Z",
    read: false,
  },
  {
    id: "n8",
    type: "system",
    title: "Guest checked in",
    description: "Grace Mwale checked in at Luxury Safari Lodge for 4 nights.",
    timestamp: "2026-06-20T14:00:00Z",
    read: true,
  },
  {
    id: "n9",
    type: "payout",
    title: "Payout processed",
    description: "Earnings of K4,200.00 were disbursed to your registered account.",
    timestamp: "2026-06-20T06:00:00Z",
    read: false,
  },
  {
    id: "n10",
    type: "listing_approved",
    title: "Listing published",
    description: "Your listing 'Lusaka Boutique Stay' was approved and is now live.",
    timestamp: "2026-06-17T11:00:00Z",
    read: true,
  },
  {
    id: "n11",
    type: "message",
    title: "New message from Michael Tembo",
    description: "Michael Tembo sent a question regarding arrival time for the Kafue Game Drive on Jun 30.",
    timestamp: "2026-06-19T16:20:00Z",
    read: false,
  },
  {
    id: "n12",
    type: "system",
    title: "Weekly activity summary",
    description: "Your average response rate this week was 98% across all guest inquiries.",
    timestamp: "2026-06-22T12:00:00Z",
    read: false,
  },
  {
    id: "n13",
    type: "booking_cancelled",
    title: "Booking cancelled",
    description: "Mwila Phiri cancelled reservation NE-2026-8400 for Kafue Game Drive.",
    timestamp: "2026-05-12T09:00:00Z",
    read: true,
  },
  {
    id: "n14",
    type: "booking_confirmed",
    title: "Booking confirmed",
    description: "Michael Tembo's reservation for Kafue Game Drive on Jun 30 is confirmed for 2 guests.",
    timestamp: "2026-06-15T14:30:00Z",
    read: true,
  },
];

interface NotificationStore {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
  getNotificationsByType: (type?: NotificationType | "all") => AppNotification[];
  getRecentNotifications: (limit?: number) => AppNotification[];
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: mockNotifications,

      addNotification: (data) =>
        set((state) => ({
          notifications: [
            {
              ...data,
              id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              timestamp: new Date().toISOString(),
              read: false,
            },
            ...state.notifications,
          ],
        })),

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      getUnreadCount: () => get().notifications.filter((n) => !n.read).length,

      getNotificationsByType: (type) => {
        const all = get().notifications;
        if (!type || type === "all") return all;
        return all.filter((n) => n.type === type);
      },

      getRecentNotifications: (limit = 5) =>
        get()
          .notifications.sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
          )
          .slice(0, limit),
    }),
    {
      name: "nearby-escapes-notifications",
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ notifications: state.notifications }),
    },
  ),
);
