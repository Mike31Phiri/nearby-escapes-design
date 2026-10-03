"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  CalendarCheck,
  CalendarX,
  Wallet,
  Info,
  Star,
  MessageSquareText,
  BadgeCheck,
  Megaphone,
  X,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useNotificationStore } from "@/store/notificationStore";
import type { NotificationType } from "@/store/notificationStore";
import { formatTimestamp } from "@/lib/mock-host-dashboard";
import { BACKDROP_CLASS, cn } from "@/lib/utils";

const TYPE_STYLES: Record<NotificationType, { icon: typeof Bell; bg: string; fg: string }> = {
  booking_confirmed: { icon: CalendarCheck, bg: "bg-emerald-50", fg: "text-emerald-600" },
  booking_cancelled: { icon: CalendarX, bg: "bg-rose-50", fg: "text-rose-600" },
  booking_request: { icon: CalendarCheck, bg: "bg-[#f3eafb]", fg: "text-purple" },
  review_received: { icon: Star, bg: "bg-[#f3eafb]", fg: "text-purple" },
  message: { icon: MessageSquareText, bg: "bg-sky-50", fg: "text-sky-600" },
  system: { icon: Info, bg: "bg-indigo-50", fg: "text-indigo-600" },
  listing_approved: { icon: BadgeCheck, bg: "bg-emerald-50", fg: "text-emerald-600" },
  listing_rejected: { icon: BadgeCheck, bg: "bg-rose-50", fg: "text-rose-600" },
  payout: { icon: Wallet, bg: "bg-[#f3eafb]", fg: "text-purple" },
  promotion: { icon: Megaphone, bg: "bg-violet-50", fg: "text-violet-600" },
};

const MAX_VISIBLE = 8;

export function HostNotificationsPopover() {
  const router = useRouter();
  const { notifications, markAsRead, markAllAsRead, getUnreadCount } = useNotificationStore();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Center the popover over the bell on small screens (where the trigger sits
  // near the right edge) and keep it right-aligned on larger screens.
  const isDesktop = useMediaQuery("(min-width: 640px)");

  // The unread count comes from a persisted store that rehydrates from
  // localStorage on the client, so keep the badge SSR-safe until hydration.
  useEffect(() => {
    setMounted(true);
  }, []);

  const unreadCount = useMemo(() => getUnreadCount(), [getUnreadCount, notifications]);

  const visible = useMemo(
    () =>
      [...notifications]
        .sort(
          (a, b) =>
            Number(a.read) - Number(b.read) ||
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )
        .slice(0, MAX_VISIBLE),
    [notifications],
  );

  const handleItemClick = (id: string, actionUrl?: string) => {
    markAsRead(id);
    if (actionUrl) {
      setOpen(false);
      router.push(actionUrl);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative flex items-center justify-center h-9 w-9 rounded-full border border-neutral-200 bg-white text-neutral-600 hover:text-purple hover:border-purple/40 transition-colors outline-none"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          {mounted && unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white shadow-2xs" />
          )}
        </button>
      </PopoverTrigger>

      {/* Full-screen dimmed + blurred backdrop for hierarchy (same as the
          booking details dialog). Clicking it dismisses the popover. */}
      {open &&
        createPortal(
          <div
            aria-hidden="true"
            className={`fixed inset-0 z-50 ${BACKDROP_CLASS} animate-in fade-in duration-200`}
          />,
          document.body,
        )}

      <PopoverContent
        align={isDesktop ? "end" : "center"}
        sideOffset={10}
        collisionPadding={12}
        className="w-[min(92vw,380px)] rounded-2xl border border-neutral-200 bg-white p-0 shadow-[0_16px_48px_rgba(31,20,51,0.16)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-purple" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full tracking-wide">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[11px] font-bold text-purple hover:text-purple transition-colors flex items-center gap-1 outline-none"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* Body */}
        <div className="max-h-[min(60vh,420px)] overflow-y-auto scrollbar-hide">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center px-6">
              <div className="h-12 w-12 rounded-full bg-[#f3eafb] flex items-center justify-center mb-3">
                <Bell className="h-5 w-5 text-purple" />
              </div>
              <p className="text-sm font-bold text-neutral-900">All caught up!</p>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                We&apos;ll pop a notification here when something needs your attention.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {visible.map((n) => {
                const style = TYPE_STYLES[n.type] ?? TYPE_STYLES.system;
                const Icon = style.icon;
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => handleItemClick(n.id, n.actionUrl)}
                      className={cn(
                        "w-full flex gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50 outline-none",
                        !n.read && "bg-[#f3eafb]/25",
                      )}
                    >
                      <div
                        className={cn(
                          "h-9 w-9 shrink-0 rounded-full flex items-center justify-center mt-0.5",
                          style.bg,
                        )}
                      >
                        <Icon className={cn("h-4 w-4", style.fg)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={cn(
                              "text-[13px] leading-snug",
                              n.read
                                ? "text-neutral-700 font-semibold"
                                : "text-neutral-900 font-bold",
                            )}
                          >
                            {n.title}
                          </p>
                          <span className="text-xs text-black-muted whitespace-nowrap mt-0.5 shrink-0">
                            {formatTimestamp(n.timestamp)}
                          </span>
                        </div>
                        <p className="text-[12px] text-neutral-600 leading-relaxed mt-0.5 line-clamp-2">
                          {n.description}
                        </p>
                        {n.actionLabel && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple mt-1.5 hover:text-purple">
                            {n.actionLabel} →
                          </span>
                        )}
                      </div>
                      {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        {visible.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 px-4 py-2.5 border-t border-neutral-200 bg-neutral-50 text-xs text-black-muted">
            <X className="h-3 w-3" />
            Tap a notification to open it
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
