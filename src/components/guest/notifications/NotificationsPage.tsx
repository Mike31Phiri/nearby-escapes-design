"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  XCircle,
  MessageSquare,
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
  booking_confirmed: { icon: CheckCircle2, label: "Booking Confirmed", color: "text-emerald-500" },
  booking_cancelled: { icon: XCircle, label: "Cancelled", color: "text-rose-500" },
  booking_request: { icon: Clock, label: "Booking Request", color: "text-amber-500" },
  review_received: { icon: Star, label: "New Review", color: "text-amber-400" },
  message: { icon: MessageSquare, label: "Message", color: "text-blue-500" },
  system: { icon: Info, label: "System", color: "text-primary" },
  listing_approved: { icon: CheckCircle2, label: "Approved", color: "text-emerald-500" },
  listing_rejected: { icon: XCircle, label: "Rejected", color: "text-rose-500" },
  payout: { icon: DollarSign, label: "Payout", color: "text-emerald-500" },
  promotion: { icon: Megaphone, label: "Promotion", color: "text-purple-500" },
};

const FILTER_TABS: { id: NotificationType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "booking_confirmed", label: "Confirmed" },
  { id: "booking_request", label: "Requests" },
  { id: "review_received", label: "Reviews" },
  { id: "message", label: "Messages" },
  { id: "payout", label: "Payouts" },
  { id: "system", label: "System" },
];

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
        "group relative flex items-start gap-4 rounded-xl border bg-card p-4 md:p-5 shadow-sm card-shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
        n.read ? "border-border/50" : "border-primary/20 bg-primary/[0.02]",
      )}
    >
      {/* Unread dot */}
      {!n.read && (
        <div className="absolute top-4 left-4 h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
      )}

      {/* Icon */}
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          n.read ? "bg-muted" : "bg-primary/10",
        )}
      >
        <Icon className={cn("h-5 w-5", n.read ? "text-muted-foreground/60" : config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p
                className={cn(
                  "text-base leading-snug",
                  n.read ? "font-medium text-foreground" : "font-bold text-foreground",
                )}
              >
                {n.title}
              </p>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                  n.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary",
                )}
              >
                {config.label}
              </span>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed mt-1">{n.description}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-medium text-muted-foreground/60 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo(n.timestamp)}
          </span>

          {n.actionUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 rounded-full text-[10px] font-bold uppercase tracking-wider px-3 text-primary hover:bg-primary/5"
              asChild
            >
              <Link href={n.actionUrl}>
                {n.actionLabel ?? "View"}
                <ChevronRight className="h-3 w-3 ml-0.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mark as read button */}
      {!n.read && (
        <button
          onClick={() => onMarkRead(n.id)}
          className="absolute top-4 right-4 h-8 w-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/5 text-muted-foreground hover:text-primary"
          aria-label="Mark as read"
        >
          <CheckCheck className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function NotificationsPage() {
  const { notifications, getUnreadCount, getNotificationsByType, markAsRead, markAllAsRead } =
    useNotificationStore();

  const [activeFilter, setActiveFilter] = useState<NotificationType | "all">("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filtered = getNotificationsByType(activeFilter);
  const displayed = showUnreadOnly ? filtered.filter((n) => !n.read) : filtered;
  const unreadCount = getUnreadCount();

  return (
    <div className="min-h-screen flex flex-col bg-muted font-sans">
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 md:px-6 pt-8 md:pt-12 pb-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  Notifications
                </h1>
                <p className="text-base text-muted-foreground">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                    : "All caught up!"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-border/60 text-sm font-bold"
                  onClick={markAllAsRead}
                >
                  <CheckCheck className="h-4 w-4 mr-1.5" />
                  Mark All Read
                </Button>
              )}
              <Button
                variant={showUnreadOnly ? "default" : "outline"}
                size="sm"
                className="rounded-full text-sm font-bold"
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              >
                {showUnreadOnly ? "All" : "Unread Only"}
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex overflow-x-auto scrollbar-none gap-1 mb-6 -mx-4 md:mx-0 px-4 md:px-0">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              const count =
                tab.id === "all" ? notifications.length : getNotificationsByType(tab.id).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border/50",
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      "ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted-foreground/10 text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Notification List */}
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-5">
                <Inbox className="h-9 w-9 text-muted-foreground/40" />
              </div>
              <h3 className="text-xl font-bold text-foreground">No notifications</h3>
              <p className="text-base text-muted-foreground mt-1.5 max-w-sm">
                {showUnreadOnly
                  ? "You've read all your notifications. Great job staying on top of things!"
                  : "No notifications match this filter. Try a different category."}
              </p>
              {showUnreadOnly && (
                <Button
                  variant="outline"
                  className="mt-6 rounded-full text-sm font-bold"
                  onClick={() => setShowUnreadOnly(false)}
                >
                  <Bell className="h-4 w-4 mr-1.5" />
                  Show All
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {displayed.map((n) => (
                <NotificationCard key={n.id} notification={n} onMarkRead={markAsRead} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
