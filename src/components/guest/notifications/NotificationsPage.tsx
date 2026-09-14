"use client";

import Link from "next/link";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  XCircle,
  Star,
  DollarSign,
  Megaphone,
  Info,
  Clock,
  ChevronRight,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, timeAgo } from "@/lib/utils";
import {
  useNotificationStore,
  type AppNotification,
  type NotificationType,
} from "@/store/notificationStore";

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ElementType; label: string; color: string }
> = {
  booking_confirmed: { icon: CheckCircle2, label: "Confirmed", color: "text-emerald-500" },
  booking_cancelled: { icon: XCircle, label: "Cancelled", color: "text-rose-500" },
  booking_request: { icon: Clock, label: "Request", color: "text-amber-500" },
  review_received: { icon: Star, label: "Review", color: "text-amber-400" },
  message: { icon: Info, label: "Update", color: "text-[#6b2bb8]" },
  system: { icon: Info, label: "System", color: "text-[#6b2bb8]" },
  listing_approved: { icon: CheckCircle2, label: "Approved", color: "text-emerald-500" },
  listing_rejected: { icon: XCircle, label: "Rejected", color: "text-rose-500" },
  payout: { icon: DollarSign, label: "Payout", color: "text-emerald-500" },
  promotion: { icon: Megaphone, label: "Promotion", color: "text-[#6b2bb8]" },
};

function NotificationCard({
  notification: n,
  onMarkRead,
}: {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
}) {
  const config = TYPE_CONFIG[n.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 rounded-xl border bg-white p-4 transition-all duration-200 hover:shadow-sm",
        n.read ? "border-neutral-200" : "border-[#6b2bb8]/20 bg-[#6b2bb8]/[0.02]",
      )}
    >
      {/* Unread dot */}
      {!n.read && <span className="absolute top-5 left-4 h-1.5 w-1.5 rounded-full bg-[#6b2bb8]" />}

      {/* Icon */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          n.read ? "bg-neutral-100" : "bg-[#6b2bb8]/10",
        )}
      >
        <Icon className={cn("h-4 w-4", n.read ? "text-neutral-400" : config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <p
                className={cn(
                  "text-sm leading-snug",
                  n.read ? "font-normal text-neutral-700" : "font-semibold text-neutral-900",
                )}
              >
                {n.title}
              </p>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
                  n.read ? "bg-neutral-100 text-neutral-400" : "bg-[#6b2bb8]/10 text-[#6b2bb8]",
                )}
              >
                {config.label}
              </span>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed">{n.description}</p>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-3">
          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo(n.timestamp)}
          </span>

          {n.actionUrl && (
            <Link
              href={n.actionUrl}
              className="text-[11px] font-semibold text-[#6b2bb8] hover:underline flex items-center gap-0.5"
            >
              {n.actionLabel ?? "View"}
              <ChevronRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Mark as read */}
      {!n.read && (
        <button
          onClick={() => onMarkRead(n.id)}
          className="h-7 w-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#6b2bb8]/5 text-neutral-400 hover:text-[#6b2bb8] shrink-0"
          aria-label="Mark as read"
        >
          <CheckCheck className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export function NotificationsPage() {
  const { notifications, getUnreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  const unreadCount = getUnreadCount();

  return (
    <div className="min-h-screen bg-[#fbfafc] font-sans">
      <main className="mx-auto max-w-2xl px-4 md:px-6 pt-8 md:pt-12 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Notifications</h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#6b2bb8] hover:underline"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <Inbox className="h-7 w-7 text-neutral-300" />
            </div>
            <h3 className="text-base font-semibold text-neutral-700">No notifications yet</h3>
            <p className="text-sm text-neutral-400 mt-1 max-w-xs">
              We&apos;ll let you know when something important happens.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <NotificationCard key={n.id} notification={n} onMarkRead={markAsRead} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
