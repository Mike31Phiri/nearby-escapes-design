"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

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
    type: "booking_confirmed",
    title: "Booking Confirmed — Luxury Safari Lodge",
    description:
      "Your stay at Luxury Safari Lodge in Lower Zambezi has been confirmed. Check-in: Mar 15, 2025.",
    timestamp: "2025-03-10T09:30:00Z",
    read: false,
    actionUrl: "/trips",
    actionLabel: "View Trip",
  },
  {
    id: "n2",
    type: "review_received",
    title: "New Review — Victoria Falls Helicopter Tour",
    description:
      "Sarah left a 5-star review on your Victoria Falls Helicopter Tour. \"Absolutely breathtaking! Worth every kwacha.\"",
    timestamp: "2025-06-05T14:22:00Z",
    read: false,
    actionUrl: "/host",
    actionLabel: "View Review",
  },
  {
    id: "n3",
    type: "booking_request",
    title: "New Booking Request — Kafue River Lodge",
    description:
      "James Banda requested to book Kafue River Lodge for Jun 12–Jun 15. Respond to confirm or decline.",
    timestamp: "2025-06-10T08:15:00Z",
    read: false,
    actionUrl: "/host/bookings",
    actionLabel: "Respond Now",
  },
  {
    id: "n4",
    type: "system",
    title: "Welcome to Nearby Escapes! 🎉",
    description:
      "Thanks for joining! Start exploring stays, experiences, and transport across Zambia.",
    timestamp: "2025-03-01T12:00:00Z",
    read: true,
    actionUrl: "/search",
    actionLabel: "Explore",
  },
  {
    id: "n5",
    type: "booking_cancelled",
    title: "Booking Cancelled — Victoria Falls Hotel",
    description:
      "Your booking at Victoria Falls Hotel (NE-2025-8712) has been cancelled as requested.",
    timestamp: "2025-01-15T16:45:00Z",
    read: true,
    actionUrl: "/trips",
    actionLabel: "View Details",
  },
  {
    id: "n6",
    type: "listing_approved",
    title: "Listing Approved — Lusaka Boutique Stay",
    description:
      "Your listing Lusaka Boutique Stay has been approved and is now live on Nearby Escapes.",
    timestamp: "2025-06-01T11:00:00Z",
    read: false,
    actionUrl: "/host",
    actionLabel: "View Listing",
  },
  {
    id: "n7",
    type: "payout",
    title: "Payout Processed — $1,240.00",
    description:
      "Your earnings from the past month have been sent to your bank account. Estimated arrival: 2-3 business days.",
    timestamp: "2025-06-28T06:00:00Z",
    read: false,
    actionUrl: "/host",
    actionLabel: "View Earnings",
  },
  {
    id: "n8",
    type: "review_received",
    title: "New Review — Kafue Game Drive",
    description:
      "David Mulenga left a 5-star review on Kafue Game Drive. \"Moses was the best guide we've ever had!\"",
    timestamp: "2025-06-02T10:30:00Z",
    read: true,
    actionUrl: "/host",
    actionLabel: "View Review",
  },
  {
    id: "n9",
    type: "promotion",
    title: "Weekend Deal — 20% Off Lake Kariba Retreat",
    description:
      "Limited time offer! Book Lake Kariba Retreat this weekend and save 20%. Valid for stays through July.",
    timestamp: "2025-06-29T08:00:00Z",
    read: false,
    actionUrl: "/listings/stays/4",
    actionLabel: "Book Now",
  },
  {
    id: "n10",
    type: "booking_confirmed",
    title: "Booking Confirmed — Victoria Falls Helicopter Tour",
    description:
      "Your Victoria Falls Helicopter Tour on Jun 20, 2025 has been confirmed. Arrive 30 minutes early.",
    timestamp: "2025-06-12T15:00:00Z",
    read: false,
    actionUrl: "/trips",
    actionLabel: "View Trip",
  },
  {
    id: "n11",
    type: "system",
    title: "Become a Host — Unlock Earnings",
    description:
      "Did you know? Hosts on Nearby Escapes earn an average of $2,400/month. Start your hosting journey today!",
    timestamp: "2025-06-25T09:00:00Z",
    read: false,
    actionUrl: "/become-host",
    actionLabel: "Learn More",
  },
  {
    id: "n12",
    type: "message",
    title: "New Message from Sarah Phiri",
    description:
      "Hi! My husband and I are celebrating our anniversary and would love to stay at your lodge. We're interested in the sunset river cruise — is that included?",
    timestamp: "2025-06-14T19:30:00Z",
    read: false,
    actionUrl: "/host",
    actionLabel: "Reply",
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
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
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
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
          )
          .slice(0, limit),
    }),
    {
      name: "nearby-escapes-notifications",
      partialize: (state) => ({ notifications: state.notifications }),
    },
  ),
);
