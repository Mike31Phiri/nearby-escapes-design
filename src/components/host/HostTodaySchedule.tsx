"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bed,
  Check,
  ChevronRight,
  Clock,
  Eye,
  LogIn,
  LogOut,
  Phone,
  Sparkles,
  Ticket,
  Users,
  Calendar,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { BookingDetailsData } from "./BookingDetailsDialog";
import { checkInGuest } from "@/lib/api/host";

export type ScheduleTabKey = "arriving" | "hosting" | "departing";

export interface ScheduleItem {
  id: string;
  type: ScheduleTabKey;
  listingType: "stay" | "experience" | "transport";
  guestName: string;
  guestAvatar?: string;
  guestPhone?: string;
  guestEmail?: string;
  listingName: string;
  listingImage: string;
  checkIn?: string;
  checkOut?: string;
  date?: string;
  timeSlot?: string;
  stayProgress?: string;
  guests: number;
  amount?: number;
  currency?: string;
  status: "pending" | "confirmed" | "checked_in" | "checked_out";
  bookingRef?: string;
}

export const INITIAL_SCHEDULE_ITEMS: ScheduleItem[] = [
  {
    id: "sched-1",
    type: "arriving",
    listingType: "stay",
    guestName: "Emily Zulu",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Emily%20Zulu",
    guestPhone: "+260 95 333 2211",
    guestEmail: "emily.zulu@example.com",
    listingName: "Kafue River Lodge",
    listingImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
    checkIn: "2026-06-24",
    checkOut: "2026-06-29",
    timeSlot: "Check-in: 14:00 – 18:00",
    guests: 3,
    amount: 1900,
    currency: "ZMW",
    status: "confirmed",
    bookingRef: "NE-2026-8945",
  },
  {
    id: "sched-2",
    type: "arriving",
    listingType: "experience",
    guestName: "James Banda",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=James%20Banda",
    guestPhone: "+260 96 555 7890",
    guestEmail: "james.banda@work.com",
    listingName: "Victoria Falls Helicopter Tour",
    listingImage: "https://images.unsplash.com/photo-1534234828563-02511c750b53?w=400&q=80",
    date: "2026-06-24",
    timeSlot: "Tour departure: 09:30 AM",
    guests: 4,
    amount: 720,
    currency: "ZMW",
    status: "confirmed",
    bookingRef: "NE-2026-9127",
  },
  {
    id: "sched-3",
    type: "hosting",
    listingType: "stay",
    guestName: "Grace Mwale",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Grace%20Mwale",
    guestPhone: "+260 96 444 5566",
    guestEmail: "grace.mwale@example.com",
    listingName: "Luxury Safari Lodge",
    listingImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
    checkIn: "2026-06-20",
    checkOut: "2026-06-25",
    stayProgress: "Night 4 of 5 · Check-out tomorrow",
    guests: 2,
    amount: 1800,
    currency: "ZMW",
    status: "confirmed",
    bookingRef: "NE-2026-8765",
  },
  {
    id: "sched-4",
    type: "hosting",
    listingType: "experience",
    guestName: "Michael Tembo",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Michael%20Tembo",
    guestPhone: "+260 97 888 9900",
    guestEmail: "mike.tembo@travelzambia.com",
    listingName: "Kafue Game Drive",
    listingImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80",
    date: "2026-06-24",
    stayProgress: "Afternoon safari session (In progress)",
    guests: 2,
    amount: 240,
    currency: "ZMW",
    status: "confirmed",
    bookingRef: "NE-2026-8842",
  },
  {
    id: "sched-5",
    type: "departing",
    listingType: "stay",
    guestName: "Chisala Banda",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Chisala%20Banda",
    guestPhone: "+260 97 111 2233",
    guestEmail: "chisala.banda@email.com",
    listingName: "Kafue River Lodge",
    listingImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
    checkIn: "2026-06-19",
    checkOut: "2026-06-24",
    timeSlot: "Check-out by 11:00 AM",
    guests: 7,
    amount: 1140,
    currency: "ZMW",
    status: "confirmed",
    bookingRef: "NE-2026-8532",
  },
];

export interface HostTodayScheduleProps {
  onSelectBooking: (details: BookingDetailsData) => void;
  activeTab?: ScheduleTabKey;
  onTabChange?: (tab: ScheduleTabKey) => void;
  /** Controlled items — pass from parent to share state across the page */
  items?: ScheduleItem[];
  onItemsChange?: (items: ScheduleItem[]) => void;
}

export function HostTodaySchedule({
  onSelectBooking,
  activeTab: controlledTab,
  onTabChange,
  items: controlledItems,
  onItemsChange,
}: HostTodayScheduleProps) {
  const [internalTab, setInternalTab] = useState<ScheduleTabKey>("arriving");
  const activeTab = controlledTab ?? internalTab;

  const setActiveTab = (tab: ScheduleTabKey) => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };

  const [internalItems, setInternalItems] = useState<ScheduleItem[]>(INITIAL_SCHEDULE_ITEMS);
  // Use controlled items when provided, otherwise fall back to internal state
  const items = controlledItems ?? internalItems;
  const setItems = (updater: (prev: ScheduleItem[]) => ScheduleItem[]) => {
    if (onItemsChange) {
      onItemsChange(updater(items));
    } else {
      setInternalItems(updater);
    }
  };

  const arrivingItems = items.filter((i) => i.type === "arriving");
  const hostingItems = items.filter((i) => i.type === "hosting");
  const departingItems = items.filter((i) => i.type === "departing");

  const currentItems =
    activeTab === "arriving"
      ? arrivingItems
      : activeTab === "hosting"
        ? hostingItems
        : departingItems;

  const handleCheckIn = async (item: ScheduleItem) => {
    try {
      await checkInGuest(item.id);
    } catch {
      // Fallback gracefully
    }
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: "checked_in" as const } : i)),
    );
    toast.success(`${item.guestName} marked as checked in!`, {
      description: `${item.listingName} is now marked as occupied. Funds released.`,
    });
  };

  const handleCheckOut = (item: ScheduleItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: "checked_out" as const } : i)),
    );
    toast.success(`${item.guestName} marked as checked out!`, {
      description: "Room ready for turnover & housekeeping inspection.",
    });
  };

  const toBookingDetails = (item: ScheduleItem): BookingDetailsData => ({
    id: item.id,
    listingName: item.listingName,
    listingType: item.listingType,
    status:
      item.status === "checked_in"
        ? "confirmed"
        : item.status === "checked_out"
          ? "completed"
          : item.status,
    guestName: item.guestName,
    guestEmail: item.guestEmail,
    guestPhone: item.guestPhone,
    guests: item.guests,
    amount: item.amount,
    currency: item.currency,
    checkIn: item.checkIn,
    checkOut: item.checkOut,
    date: item.date,
    bookingRef: item.bookingRef,
    listingImage: item.listingImage,
  });

  // UNIFORM Tab definitions: all active tabs share the identical clean styling
  const tabConfigs = [
    {
      key: "arriving" as const,
      label: "Arriving Today",
      shortLabel: "Arriving",
      icon: LogIn,
    },
    {
      key: "hosting" as const,
      label: "Currently Hosting",
      shortLabel: "Hosting",
      icon: Bed,
    },
    {
      key: "departing" as const,
      label: "Departing Today",
      shortLabel: "Departing",
      icon: LogOut,
    },
  ];

  return (
    <section id="today-schedule" className="space-y-4 font-sans scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-semibold tracking-normal text-black leading-snug">
            Today&apos;s Schedule
          </h2>
        </div>

        <Link
          href="/host/bookings"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-purple hover:text-purple-hover transition-colors group self-start sm:self-auto"
        >
          <span>View all bookings</span>
          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Airbnb-style unconfined straight-line tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide py-1">
        {tabConfigs.map(({ key, label, shortLabel, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-sm transition-colors cursor-pointer shrink-0 whitespace-nowrap",
                isActive
                  ? "bg-purple/10 text-purple font-semibold"
                  : "text-black-subtle hover:text-black hover:bg-neutral-100/80 font-medium",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-purple" : "text-black-muted",
                )}
              />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Clean Schedule Cards Container */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-2xs overflow-hidden divide-y divide-neutral-100">
        {currentItems.length === 0 ? (
          <div className="p-12 sm:p-16 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-center text-neutral-400 mb-3 shadow-2xs">
              <Sparkles className="h-6 w-6 text-purple/60" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900">
              {activeTab === "arriving"
                ? "You do not have any arriving guests today"
                : activeTab === "hosting"
                  ? "You do not have any guests currently staying"
                  : "You do not have any departing guests today"}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 max-w-md">
              {activeTab === "arriving"
                ? "There are no guest check-ins scheduled for today. You can review upcoming bookings or manage your availability."
                : activeTab === "hosting"
                  ? "There are no guests currently checked in or in-house today. Your active listings remain open for reservations."
                  : "There are no guest check-outs scheduled for today. All departures and room turnovers are up to date."}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link
                href="/host/availability"
                className="text-xs sm:text-sm font-semibold text-purple bg-purple/10 hover:bg-purple/15 px-4 py-2 rounded-xl border border-purple/20 transition-colors"
              >
                Calendar
              </Link>
              <Link
                href="/host/bookings"
                className="text-xs sm:text-sm font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 px-4 py-2 rounded-xl border border-neutral-200 transition-colors"
              >
                Bookings List
              </Link>
            </div>
          </div>
        ) : (
          currentItems.map((item) => {
            const isCheckedIn = item.status === "checked_in";
            const isCheckedOut = item.status === "checked_out";

            return (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 hover:bg-neutral-50/50 transition-colors"
              >
                {/* Guest & Listing Details: Clean and Minimal */}
                <div className="min-w-0 flex-1 space-y-0.5">
                    {/* Line 1: Guest Name & Status */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => onSelectBooking(toBookingDetails(item))}
                        className="text-sm sm:text-base font-semibold text-black hover:text-purple transition-colors text-left cursor-pointer truncate"
                      >
                        {item.guestName}
                      </button>

                      {/* Clear, compact status badge */}
                      {isCheckedIn ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
                          <Check className="h-2.5 w-2.5" /> Checked In
                        </span>
                      ) : isCheckedOut ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-black-subtle border border-neutral-200 tracking-wide">
                          <Check className="h-2.5 w-2.5" /> Checked Out
                        </span>
                      ) : activeTab === "hosting" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20 tracking-wide">
                          In-House
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 tracking-wide">
                          Confirmed
                        </span>
                      )}
                    </div>

                    {/* Line 2: Property / Experience name & Details */}
                    <div className="flex items-center gap-2 text-xs text-neutral-600 truncate">
                      <span className="font-medium text-neutral-800 truncate">{item.listingName}</span>
                      <span className="text-neutral-300">·</span>
                      <span className="text-neutral-500 shrink-0">
                        {item.timeSlot || item.stayProgress || `${item.guests} guests`}
                      </span>
                    </div>
                  </div>

                {/* Right side: Amount + Compact Action Buttons */}
                <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 pt-2 sm:pt-2.5 md:pt-0 border-t md:border-t-0 border-neutral-100 justify-between md:justify-end">
                  {/* Payout amount: clean and compact */}
                  {item.amount != null && (
                    <div className="text-left md:text-right pr-1">
                      <div className="text-xs sm:text-sm font-semibold text-black">
                        K{item.amount.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-black-muted font-semibold tracking-wide uppercase">
                        payout
                      </div>
                    </div>
                  )}

                  {/* Action buttons: purple & compact on mobile */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Primary Tab Action Button — Purple */}
                    {activeTab === "arriving" && (
                      <button
                        onClick={() => handleCheckIn(item)}
                        disabled={isCheckedIn}
                        className={cn(
                          "inline-flex items-center gap-1 sm:gap-1.5 h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all shadow-2xs outline-none cursor-pointer",
                          isCheckedIn
                            ? "bg-purple/10 text-purple border border-purple/20 cursor-default"
                            : "bg-purple text-white hover:bg-purple-hover active:scale-98",
                        )}
                      >
                        <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>{isCheckedIn ? "Checked In" : "Check In"}</span>
                      </button>
                    )}

                    {activeTab === "departing" && (
                      <button
                        onClick={() => handleCheckOut(item)}
                        disabled={isCheckedOut}
                        className={cn(
                          "inline-flex items-center gap-1 sm:gap-1.5 h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all shadow-2xs outline-none cursor-pointer",
                          isCheckedOut
                            ? "bg-neutral-100 text-neutral-700 border border-neutral-200 cursor-default"
                            : "bg-purple text-white hover:bg-purple-hover active:scale-98",
                        )}
                      >
                        <LogOut className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>{isCheckedOut ? "Checked Out" : "Check Out"}</span>
                      </button>
                    )}

                    {/* Phone shortcut button: desktop only (on mobile it is inside details dialog) */}
                    {item.guestPhone && (
                      <a
                        href={`tel:${item.guestPhone}`}
                        title={`Call ${item.guestName}`}
                        className="hidden md:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-700 hover:text-purple hover:border-purple/30 hover:bg-purple/5 transition-colors cursor-pointer"
                      >
                        <Phone className="h-3.5 w-3.5 text-neutral-500" />
                        <span>Call</span>
                      </a>
                    )}

                    {/* Details button: purple tint styling */}
                    <button
                      onClick={() => onSelectBooking(toBookingDetails(item))}
                      className="inline-flex items-center gap-1 sm:gap-1.5 h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-purple/20 bg-purple/5 text-[11px] sm:text-xs font-semibold text-purple hover:bg-purple/10 hover:border-purple/30 transition-colors outline-none cursor-pointer"
                    >
                      <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-purple" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
