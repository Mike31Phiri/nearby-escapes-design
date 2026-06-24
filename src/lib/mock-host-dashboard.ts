export interface DashboardAlert {
  id: string;
  type: "warning" | "info" | "success";
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export interface OperationalQueueItem {
  id: string;
  type: "arriving" | "hosting" | "checking-out";
  guestName: string;
  guestAvatar: string;
  listingName: string;
  listingImage: string;
  checkIn?: string;
  checkOut?: string;
  guests: number;
  status: "pending" | "confirmed";
}

export interface ActivityFeedItem {
  id: string;
  type: "booking" | "review" | "payout" | "message" | "system";
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
}

export interface WeeklySnapshot {
  revenue: number;
  revenueChange: number;
  bookings: number;
  bookingsChange: number;
  occupancyRate: number;
  occupancyChange: number;
  pageViews: number;
  pageViewsChange: number;
  avgRating?: number;
  reviewCount?: number;
}

export interface ContextualTip {
  id: string;
  title: string;
  description: string;
  type: "pricing" | "visibility" | "quality" | "response";
  actionLabel?: string;
  actionHref?: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────

export const mockDashboardAlerts: DashboardAlert[] = [
  {
    id: "alert-1",
    type: "warning",
    title: "Booking request expires soon",
    description:
      "Sarah Phiri's request for Luxury Safari Lodge (ZMW 1,800) expires in 2 hours. Respond now to secure the booking.",
    actionLabel: "Review Request",
    actionHref: "/host/bookings",
  },
  {
    id: "alert-2",
    type: "info",
    title: "New message from James Banda",
    description:
      "James has a follow-up question about the Victoria Falls Helicopter Tour. Quick replies help maintain your 98% response rate.",
    actionLabel: "Open Chat",
    actionHref: "/host/notifications",
  },
];

export const mockOperationalQueue: OperationalQueueItem[] = [
  {
    id: "op-1",
    type: "arriving",
    guestName: "Emily Zulu",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Emily%20Zulu",
    listingName: "Kafue River Lodge",
    listingImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
    checkIn: "2026-06-24",
    checkOut: "2026-06-29",
    guests: 3,
    status: "confirmed",
  },
  {
    id: "op-2",
    type: "arriving",
    guestName: "Grace Mwale",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Grace%20Mwale",
    listingName: "Luxury Safari Lodge",
    listingImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
    checkIn: "2026-06-20",
    checkOut: "2026-06-24",
    guests: 2,
    status: "confirmed",
  },
  {
    id: "op-3",
    type: "hosting",
    guestName: "Grace Mwale",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Grace%20Mwale",
    listingName: "Luxury Safari Lodge",
    listingImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
    guests: 2,
    status: "confirmed",
  },
  {
    id: "op-4",
    type: "checking-out",
    guestName: "Chisala Banda",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Chisala%20Banda",
    listingName: "Kafue River Lodge",
    listingImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
    checkOut: "2026-06-22",
    guests: 7,
    status: "confirmed",
  },
];

export const mockActivityFeed: ActivityFeedItem[] = [
  {
    id: "act-1",
    type: "booking",
    title: "New booking confirmed",
    description: "Michael Tembo confirmed Kafue Game Drive for Jun 30 — ZMW 240",
    timestamp: "2026-06-21T14:30:00Z",
  },
  {
    id: "act-2",
    type: "message",
    title: "Sarah replied",
    description: "Sarah Phiri responded about the anniversary package",
    timestamp: "2026-06-21T09:15:00Z",
  },
  {
    id: "act-3",
    type: "review",
    title: "New 5-star review",
    description:
      "Grace Mwale left a fantastic review for Luxury Safari Lodge: 'The room was stunning!'",
    timestamp: "2026-06-24T11:20:00Z",
  },
  {
    id: "act-4",
    type: "payout",
    title: "Payout processed",
    description: "ZMW 3,420 deposited to your account — bookings ZMW 1,800 + ZMW 1,140",
    timestamp: "2026-06-19T06:00:00Z",
  },
  {
    id: "act-5",
    type: "booking",
    title: "Booking request received",
    description: "Sarah Phiri requested Luxury Safari Lodge (Jun 25-29) — ZMW 1,800",
    timestamp: "2026-06-20T10:30:00Z",
  },
  {
    id: "act-6",
    type: "system",
    title: "Listing view milestone",
    description: "Your Luxury Safari Lodge reached 500 views this month",
    timestamp: "2026-06-18T08:00:00Z",
  },
  {
    id: "act-7",
    type: "message",
    title: "James asked a question",
    description: "James Banda enquired about photography equipment on helicopter tour",
    timestamp: "2026-06-21T10:15:00Z",
  },
];

export const mockWeeklySnapshot: WeeklySnapshot = {
  revenue: 12450,
  revenueChange: 14.5,
  bookings: 18,
  bookingsChange: 5.2,
  occupancyRate: 68,
  occupancyChange: 12,
  pageViews: 1240,
  pageViewsChange: -2.4,
  avgRating: 4.8,
  reviewCount: 124,
};

export const mockContextualTips: ContextualTip[] = [
  {
    id: "tip-1",
    title: "Lower your price for next weekend",
    description:
      "Your Luxury Safari Lodge has 0 bookings for next weekend. A 15% discount could make it more competitive — similar lodges in Lower Zambezi average 2 bookings on weekends.",
    type: "pricing",
    actionLabel: "Update Pricing",
    actionHref: "/host/availability",
  },
  {
    id: "tip-2",
    title: "Boost your visibility",
    description:
      "Listings with professional photos get 40% more views. Consider adding more high-quality images to your Victoria Falls Helicopter Tour listing.",
    type: "visibility",
    actionLabel: "Edit Listing",
    actionHref: "/host/listings",
  },
  {
    id: "tip-3",
    title: "Keep up the great response rate!",
    description:
      "Your response rate is 98% — excellent! Quick replies are a key factor in maintaining your status and getting more bookings.",
    type: "response",
  },
];

export function formatTimestamp(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) {
    const mins = Math.floor(diff / (1000 * 60));
    return `${mins}m ago`;
  }
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
