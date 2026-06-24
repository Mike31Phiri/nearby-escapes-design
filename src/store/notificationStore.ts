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
    title: "Message from Grace Mwale",
    description:
      "Hi! Everything has been absolutely wonderful at the lodge. Just wanted to ask — is the sunset river cruise still available for tomorrow evening? We'd love to book it!",
    timestamp: "2026-06-22T15:30:00Z",
    read: false,
    actionUrl: "/notifications",
    actionLabel: "Reply",
  },
  {
    id: "n2",
    type: "booking_request",
    title: "Booking Request — Luxury Safari Lodge",
    description:
      "Sarah Phiri requested to book Luxury Safari Lodge for Jun 25–Jun 29. Review and respond to confirm or decline.",
    timestamp: "2026-06-20T10:30:00Z",
    read: false,
    actionUrl: "/host/bookings",
    actionLabel: "Respond Now",
  },
  {
    id: "n3",
    type: "booking_request",
    title: "Booking Request — Victoria Falls Helicopter Tour",
    description:
      "James Banda requested a 2-hour helicopter tour for Jun 28. Respond to confirm availability.",
    timestamp: "2026-06-21T14:15:00Z",
    read: false,
    actionUrl: "/host/bookings",
    actionLabel: "Respond Now",
  },
  {
    id: "n4",
    type: "booking_request",
    title: "Booking Request — Kafue River Lodge",
    description:
      "Emily Zulu requested to book Kafue River Lodge for Jun 24–Jun 29. Respond to confirm or decline.",
    timestamp: "2026-06-19T09:45:00Z",
    read: false,
    actionUrl: "/host/bookings",
    actionLabel: "Respond Now",
  },
  {
    id: "n5",
    type: "system",
    title: "Check-out Today — Kafue River Lodge",
    description:
      "Chisala Banda and their family group of 7 checked out of Kafue River Lodge today. Leave a review and prepare the property for the next guests.",
    timestamp: "2026-06-22T10:00:00Z",
    read: false,
    actionUrl: "/host",
    actionLabel: "View Details",
  },
  {
    id: "n6",
    type: "review_received",
    title: "New 5-Star Review — Helicopter Tour",
    description:
      'David Mulenga left a 5-star review on the Victoria Falls Helicopter Tour. "Incredible experience — the views of the falls from above were absolutely breathtaking!"',
    timestamp: "2026-06-21T18:00:00Z",
    read: false,
    actionUrl: "/host",
    actionLabel: "View Review",
  },
  {
    id: "n7",
    type: "system",
    title: "Review Needed — David Mulenga",
    description:
      "David Mulenga completed their Victoria Falls Helicopter Tour yesterday. Take a moment to leave a review — guests appreciate quick responses!",
    timestamp: "2026-06-22T08:00:00Z",
    read: false,
    actionUrl: "/host",
    actionLabel: "Leave Review",
  },
  {
    id: "n8",
    type: "system",
    title: "Grace Mwale Checked In",
    description:
      "Grace Mwale and their party have arrived at Luxury Safari Lodge (Jun 20–Jun 24). They're currently on night 3 of 4.",
    timestamp: "2026-06-20T14:00:00Z",
    read: true,
    actionUrl: "/host",
    actionLabel: "View Booking",
  },
  {
    id: "n9",
    type: "payout",
    title: "Payout Processed — K4,200.00",
    description:
      "Your earnings from this month (K4,200.00) have been sent to your bank account. Estimated arrival: 2–3 business days.",
    timestamp: "2026-06-20T06:00:00Z",
    read: false,
    actionUrl: "/host/finances",
    actionLabel: "View Earnings",
  },
  {
    id: "n10",
    type: "listing_approved",
    title: "Listing Approved — Lusaka Boutique Stay",
    description:
      "Your listing 'Lusaka Boutique Stay' has been approved and is now live on Nearby Escapes. It's visible in search results.",
    timestamp: "2026-06-17T11:00:00Z",
    read: true,
    actionUrl: "/host/listings",
    actionLabel: "View Listing",
  },
  {
    id: "n11",
    type: "message",
    title: "Message from Michael Tembo",
    description:
      "Hi! Just confirming our Kafue Game Drive on Jun 30. What time should we arrive? Also, do you provide binoculars or should we bring our own?",
    timestamp: "2026-06-19T16:20:00Z",
    read: false,
    actionUrl: "/notifications",
    actionLabel: "Reply",
  },
  {
    id: "n12",
    type: "system",
    title: "Host Performance — This Week",
    description:
      "Your response rate is 98% — excellent! You have 3 pending requests awaiting your response. Quick replies help maintain your Superhost status.",
    timestamp: "2026-06-22T12:00:00Z",
    read: false,
    actionUrl: "/host/performance",
    actionLabel: "View Stats",
  },
  {
    id: "n13",
    type: "promotion",
    title: "Boost Your Listings — Weekend Promo",
    description:
      "Limited time: Boost your listings this weekend and get 30% more visibility in search results. Hosts who boost see an average of 40% more bookings.",
    timestamp: "2026-06-19T08:00:00Z",
    read: false,
    actionUrl: "/host",
    actionLabel: "Learn More",
  },
  {
    id: "n14",
    type: "booking_cancelled",
    title: "Booking Cancelled — Kafue Game Drive",
    description:
      "Mwila Phiri cancelled their Kafue Game Drive booking (ref: NE-2026-8400). This date is now available for re-booking.",
    timestamp: "2026-05-12T09:00:00Z",
    read: true,
    actionUrl: "/host/availability",
    actionLabel: "Update Calendar",
  },
  {
    id: "n15",
    type: "booking_confirmed",
    title: "Upcoming — Kafue Game Drive",
    description:
      "Michael Tembo's Kafue Game Drive on Jun 30 is confirmed. 2 guests, morning session.",
    timestamp: "2026-06-15T14:30:00Z",
    read: true,
    actionUrl: "/host/bookings",
    actionLabel: "View Details",
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
