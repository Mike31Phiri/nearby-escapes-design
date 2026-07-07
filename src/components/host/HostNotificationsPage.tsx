"use client";

import { useState } from "react";
import { Bell, CalendarCheck, CalendarX, Wallet, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { HostPageHeader } from "@/components/layout/HostPageHeader";
import { toast } from "sonner";

type NotificationType = "booking" | "cancellation" | "payout" | "system";

interface HostNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  isUnread: boolean;
  actionText?: string;
}

const mockNotifications: HostNotification[] = [
  {
    id: "notif-1",
    type: "booking",
    title: "New Booking Request",
    message: "Michael Scott has requested to book The Grand Escape from Jul 12 to Jul 15.",
    date: "2 hours ago",
    isUnread: true,
    actionText: "Review Request",
  },
  {
    id: "notif-2",
    type: "payout",
    title: "Payout Processed",
    message: "Your payout of K1,450 for booking BK-981 has been sent to your bank account.",
    date: "Yesterday",
    isUnread: true,
  },
  {
    id: "notif-3",
    type: "cancellation",
    title: "Reservation Cancelled",
    message:
      "Sarah Jenkins cancelled their stay at Cozy Cabin (Aug 2 - Aug 5). Your calendar has been freed.",
    date: "2 days ago",
    isUnread: false,
    actionText: "View Details",
  },
  {
    id: "notif-4",
    type: "system",
    title: "Update your tax details",
    message: "Please ensure your tax information is up to date for the current financial year.",
    date: "1 week ago",
    isUnread: false,
    actionText: "Update Now",
  },
];

export function HostNotificationsPage() {
  const [notifications, setNotifications] = useState<HostNotification[]>(mockNotifications);

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case "booking":
        return <CalendarCheck className="h-5 w-5 text-emerald-600" />;
      case "cancellation":
        return <CalendarX className="h-5 w-5 text-rose-600" />;
      case "payout":
        return <Wallet className="h-5 w-5 text-[#1f1433]" />;
      case "system":
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getBgForType = (type: NotificationType) => {
    switch (type) {
      case "booking":
        return "bg-emerald-50";
      case "cancellation":
        return "bg-rose-50";
      case "payout":
        return "bg-[#FDF9ED]";
      case "system":
        return "bg-blue-50";
      default:
        return "bg-gray-50";
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    toast.success("All notifications marked as read");
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n)));
  };

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification dismissed");
  };

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  return (
    <div className="min-h-screen pb-6 md:pb-8 bg-background">
      <HostPageHeader
        eyebrow="Updates"
        title="Notifications"
        description="Stay on top of bookings, messages, and platform alerts."
        actions={
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <span className="bg-[#f2ba0d] text-[#1f1433] text-sm font-black px-3 py-1 rounded-full shadow-sm">
                {unreadCount} new
              </span>
            )}
            {notifications.length > 0 && unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-base font-bold text-white/80 hover:text-white transition-colors outline-none"
              >
                Mark all as read
              </button>
            )}
          </div>
        }
      />
      <div className="mx-auto max-w-3xl px-4 md:px-6 mt-8">
        <div className="bg-transparent pt-2 flex flex-col">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-14 w-14 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-muted-foreground/35" />
              </div>
              <h3 className="text-[15px] font-bold text-gray-800">All caught up!</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs leading-relaxed">
                You have no new notifications. We&apos;ll let you know when something requires your
                attention.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className="group relative py-5 flex gap-4 transition-colors border-b border-gray-200/60 hover:bg-black/[0.015] px-1.5 cursor-pointer"
              >
                <div
                  className={cn(
                    "h-10 w-10 shrink-0 rounded-full flex items-center justify-center mt-1",
                    getBgForType(notif.type),
                  )}
                >
                  {getIconForType(notif.type)}
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex justify-between items-start gap-4 mb-1">
                    <h3
                      className={cn(
                        "text-[15px] tracking-tight",
                        notif.isUnread ? "font-bold text-gray-900" : "font-semibold text-gray-700",
                      )}
                    >
                      {notif.title}
                    </h3>
                    <span className="text-[11px] text-gray-400 whitespace-nowrap mt-0.5">
                      {notif.date}
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-600 leading-relaxed mb-3 pr-2">
                    {notif.message}
                  </p>
                  {notif.actionText && (
                    <button className="text-[13px] font-bold text-[#1f1433] hover:text-[#2A1846] transition-colors outline-none">
                      {notif.actionText} &rarr;
                    </button>
                  )}
                </div>
                <div className="absolute right-2 top-5 flex items-center gap-2">
                  {notif.isUnread && <div className="w-2 h-2 rounded-full bg-rose-500"></div>}
                  <button
                    onClick={(e) => dismissNotification(notif.id, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 outline-none"
                    title="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
