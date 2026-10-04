"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import { useNotificationStore, type AppNotification } from "@/store/notificationStore";

function NotificationCard({
  notification: n,
  onMarkRead,
}: {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
}) {
  return (
    <div
      onClick={() => onMarkRead(n.id)}
      className={cn(
        "group flex items-start gap-3.5 rounded-xl border p-4 transition-all duration-150 cursor-pointer select-none",
        n.read
          ? "bg-white border-neutral-200/80 text-neutral-600 hover:border-neutral-300"
          : "bg-white border-purple/30 shadow-xs text-neutral-900 hover:border-purple/50",
      )}
    >
      {/* Clean Unread Indicator Dot */}
      <div className="pt-1 shrink-0">
        <div
          className={cn(
            "h-2 w-2 rounded-full transition-colors",
            n.read ? "bg-transparent" : "bg-purple ring-2 ring-purple/20",
          )}
        />
      </div>

      {/* Content — pure, clean informational layout */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <h4
            className={cn(
              "text-[13px] sm:text-sm leading-snug",
              n.read ? "font-medium text-neutral-700" : "font-bold text-neutral-900",
            )}
          >
            {n.title}
          </h4>
          <span className="text-[11px] text-neutral-400 shrink-0 whitespace-nowrap font-medium">
            {timeAgo(n.timestamp)}
          </span>
        </div>
        <p className="text-xs sm:text-[13px] text-neutral-500 leading-relaxed mt-1">
          {n.description}
        </p>
      </div>
    </div>
  );
}

export function NotificationsPage() {
  const [mounted, setMounted] = useState(false);
  const { notifications, getUnreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const unreadCount = mounted ? getUnreadCount() : 0;
  const list = mounted ? notifications : [];

  return (
    <div className="min-h-screen bg-[#faf8f4] font-sans">
      <main className="mx-auto max-w-2xl px-4 md:px-6 pt-8 md:pt-12 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200/80">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-purple/10 flex items-center justify-center text-purple">
              <Bell className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-neutral-900">Notifications</h1>
              <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                {unreadCount > 0 ? `${unreadCount} unread update${unreadCount !== 1 ? "s" : ""}` : "You're all caught up"}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-xs font-semibold text-purple hover:underline cursor-pointer py-1 px-2"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        {!mounted ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white rounded-xl border border-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-neutral-200/60 p-8 shadow-2xs">
            <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3 text-neutral-400">
              <Inbox className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-neutral-800">No notifications yet</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs leading-relaxed">
              Updates about your bookings, messages, and activity will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {list.map((n) => (
              <NotificationCard key={n.id} notification={n} onMarkRead={markAsRead} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
