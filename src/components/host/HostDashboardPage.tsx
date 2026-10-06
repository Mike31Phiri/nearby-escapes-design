"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  LogIn,
  LogOut,
  CalendarOff,
  Users,
  ArrowRight,
  Check,
  Phone,
  Mail,
  Calendar,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BACKDROP_CLASS } from "@/lib/utils";
import { HostPageHeader } from "@/components/layout/HostPageHeader";
import { ROUTES } from "@/lib/constants/routes";
import { mockHostProfile } from "@/lib/mock-profile-data";
import { useNotificationStore } from "@/store/notificationStore";
import { BookingDetailsDialog } from "./BookingDetailsDialog";
import type { BookingDetailsData } from "./BookingDetailsDialog";
import { HostTodaySchedule, type ScheduleTabKey, type ScheduleItem, INITIAL_SCHEDULE_ITEMS } from "./HostTodaySchedule";
import { BlockDateDialog } from "./BlockDateDialog";
import { useAuth } from "@/lib/store/authStore";
import { getMyProperties, getTodaySchedule } from "@/lib/api/host";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}



// ---------------------------------------------------------------------------
// Check-In Dialog
// ---------------------------------------------------------------------------

function CheckInDialog({
  open,
  onOpenChange,
  items,
  onCheckIn,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  items: ScheduleItem[];
  onCheckIn: (id: string) => void;
}) {
  const arriving = items.filter((i) => i.type === "arriving");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName={BACKDROP_CLASS}
        className="w-[min(92vw,440px)] max-w-sm p-0 overflow-hidden flex flex-col max-h-[85dvh] rounded-2xl border border-neutral-200/80 shadow-xl font-sans"
      >
        <DialogTitle className="sr-only">Check In Guests</DialogTitle>

        {/* Header */}
        <div className="bg-neutral-50/70 border-b border-neutral-200/80 px-5 pt-6 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple/10 text-purple border border-purple/20 flex items-center justify-center shrink-0">
              <LogIn className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-neutral-900 leading-tight">Check In Guests</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                {arriving.length === 0 ? "No arrivals today" : `${arriving.length} guest${arriving.length > 1 ? "s" : ""} arriving today`}
              </p>
            </div>
          </div>
        </div>

        {/* Guest list */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
          {arriving.length === 0 ? (
            <div className="p-10 text-center text-sm text-neutral-400">
              No guests are scheduled to arrive today.
            </div>
          ) : (
            arriving.map((item) => {
              const checkedIn = item.status === "checked_in";
              return (
                <div key={item.id} className="px-5 py-4 flex items-start gap-3.5">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-purple/10 border border-purple/20 text-purple text-sm font-semibold flex items-center justify-center shrink-0">
                    {item.guestName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-neutral-900">{item.guestName}</p>
                      {checkedIn && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
                          <Check className="h-2.5 w-2.5" /> Checked In
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5 truncate">{item.listingName}</p>
                    {item.timeSlot && (
                      <p className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {item.timeSlot}
                      </p>
                    )}
                    {item.guestPhone && (
                      <a
                        href={`tel:${item.guestPhone}`}
                        className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-purple transition-colors mt-0.5"
                      >
                        <Phone className="h-3 w-3" /> {item.guestPhone}
                      </a>
                    )}
                  </div>
                  {/* Action */}
                  <button
                    onClick={() => !checkedIn && onCheckIn(item.id)}
                    disabled={checkedIn}
                    className={`shrink-0 h-8 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      checkedIn
                        ? "bg-purple/10 text-purple border border-purple/20 cursor-default"
                        : "bg-purple text-white hover:bg-purple-hover active:scale-98 shadow-xs"
                    }`}
                  >
                    {checkedIn ? "Done" : "Check In"}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-neutral-200/80 bg-white px-5 py-3 flex justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="h-9 px-5 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Check-Out Dialog
// ---------------------------------------------------------------------------

function CheckOutDialog({
  open,
  onOpenChange,
  items,
  onCheckOut,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  items: ScheduleItem[];
  onCheckOut: (id: string) => void;
}) {
  const departing = items.filter((i) => i.type === "departing");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName={BACKDROP_CLASS}
        className="w-[min(92vw,440px)] max-w-sm p-0 overflow-hidden flex flex-col max-h-[85dvh] rounded-2xl border border-neutral-200/80 shadow-xl font-sans"
      >
        <DialogTitle className="sr-only">Check Out Guests</DialogTitle>

        {/* Header */}
        <div className="bg-neutral-50/70 border-b border-neutral-200/80 px-5 pt-6 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple/10 text-purple border border-purple/20 flex items-center justify-center shrink-0">
              <LogOut className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-neutral-900 leading-tight">Check Out Guests</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                {departing.length === 0 ? "No departures today" : `${departing.length} guest${departing.length > 1 ? "s" : ""} departing today`}
              </p>
            </div>
          </div>
        </div>

        {/* Guest list */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
          {departing.length === 0 ? (
            <div className="p-10 text-center text-sm text-neutral-400">
              No guests are scheduled to depart today.
            </div>
          ) : (
            departing.map((item) => {
              const checkedOut = item.status === "checked_out";
              return (
                <div key={item.id} className="px-5 py-4 flex items-start gap-3.5">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-purple/10 border border-purple/20 text-purple text-sm font-semibold flex items-center justify-center shrink-0">
                    {item.guestName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-neutral-900">{item.guestName}</p>
                      {checkedOut && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                          <Check className="h-2.5 w-2.5" /> Checked Out
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5 truncate">{item.listingName}</p>
                    {item.timeSlot && (
                      <p className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {item.timeSlot}
                      </p>
                    )}
                    {item.guests && (
                      <p className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-1">
                        <Users className="h-3 w-3" /> {item.guests} {item.guests === 1 ? "guest" : "guests"}
                      </p>
                    )}
                    {item.guestPhone && (
                      <a
                        href={`tel:${item.guestPhone}`}
                        className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-purple transition-colors mt-0.5"
                      >
                        <Phone className="h-3 w-3" /> {item.guestPhone}
                      </a>
                    )}
                  </div>
                  {/* Action */}
                  <button
                    onClick={() => !checkedOut && onCheckOut(item.id)}
                    disabled={checkedOut}
                    className={`shrink-0 h-8 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      checkedOut
                        ? "bg-neutral-100 text-neutral-700 border border-neutral-200 cursor-default"
                        : "bg-purple text-white hover:bg-purple-hover active:scale-98 shadow-xs"
                    }`}
                  >
                    {checkedOut ? "Done" : "Check Out"}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-neutral-200/80 bg-white px-5 py-3 flex justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="h-9 px-5 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export function HostDashboardPage() {
  const { user } = useAuth();
  const isHostVerified = Boolean(user?.isHostVerified || user?.verificationStatus === "VERIFIED");
  const [mounted, setMounted] = useState(false);
  const { getUnreadCount } = useNotificationStore();
  const unread = getUnreadCount();

  const [selectedBooking, setSelectedBooking] = useState<BookingDetailsData | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [scheduleTab, setScheduleTab] = useState<ScheduleTabKey>("arriving");

  // Local schedule state — starts empty so hosts without properties see 0 items
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [myProperties, setMyProperties] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    getMyProperties()
      .then((props) => {
        if (props && props.length > 0) {
          setMyProperties(props);
          // If the host has properties, fetch their operational schedule
          getTodaySchedule()
            .then((res) => {
              if (res) {
                const combined: ScheduleItem[] = [
                  ...(res.arriving || []).map((b: any) => ({
                    id: b.bookingId || b.id,
                    guestName: b.guestName || "Guest",
                    guestPhone: b.guestPhone,
                    listingName: b.listingTitle || b.unitName || b.listingName || "Property",
                    listingType: (b.listingType || "stay") as any,
                    listingImage: b.listingImage || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
                    timeSlot: b.timeSlot || "14:00 - 18:00",
                    status: (b.status === "checked_in" ? "checked_in" : "pending") as any,
                    type: "arriving" as const,
                    guests: b.guestCount || b.guests || 1,
                  })),
                  ...((res.hosting || (res as any).currentlyHosting || [])).map((b: any) => ({
                    id: b.bookingId || b.id,
                    guestName: b.guestName || "Guest",
                    guestPhone: b.guestPhone,
                    listingName: b.listingTitle || b.unitName || b.listingName || "Property",
                    listingType: (b.listingType || "stay") as any,
                    listingImage: b.listingImage || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
                    status: "confirmed" as const,
                    type: "hosting" as const,
                    guests: b.guestCount || b.guests || 1,
                  })),
                  ...(res.departing || []).map((b: any) => ({
                    id: b.bookingId || b.id,
                    guestName: b.guestName || "Guest",
                    guestPhone: b.guestPhone,
                    listingName: b.listingTitle || b.unitName || b.listingName || "Property",
                    listingType: (b.listingType || "stay") as any,
                    listingImage: b.listingImage || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
                    timeSlot: b.timeSlot || "10:00 - 11:00",
                    status: (b.status === "checked_out" ? "checked_out" : "pending") as any,
                    type: "departing" as const,
                    guests: b.guestCount || b.guests || 1,
                  })),
                ];
                setScheduleItems(combined);
              }
            })
            .catch(() => {
              setScheduleItems([]);
            });
        } else {
          setMyProperties([]);
          setScheduleItems([]);
        }
      })
      .catch(() => {
        setMyProperties([]);
        setScheduleItems([]);
      });
  }, []);

  const handleCheckIn = (id: string) => {
    setScheduleItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "checked_in" as const } : i)),
    );
    const item = scheduleItems.find((i) => i.id === id);
    if (item) toast.success(`${item.guestName} marked as checked in!`);
  };

  const handleCheckOut = (id: string) => {
    setScheduleItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "checked_out" as const } : i)),
    );
    const item = scheduleItems.find((i) => i.id === id);
    if (item) toast.success(`${item.guestName} marked as checked out!`);
  };

  const handleJumpToSchedule = (tab: ScheduleTabKey) => {
    setScheduleTab(tab);
    const el = document.getElementById("today-schedule");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const quickActions = [
    {
      label: "Check In",
      sublabel: "Arriving today",
      icon: LogIn,
      onClick: () => setCheckInOpen(true),
    },
    {
      label: "Check Out",
      sublabel: "Departing today",
      icon: LogOut,
      onClick: () => setCheckOutOpen(true),
    },
    {
      label: "Block a Date",
      sublabel: "Close calendar dates",
      icon: CalendarOff,
      onClick: () => setBlockDialogOpen(true),
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-28 sm:pb-20 xl:pb-16 font-sans">
      <HostPageHeader
        title={`${mounted ? greeting() : "Hello"}, ${(user?.name || "Host").split(" ")[0]}`}
        actions={
          <Link
            href={ROUTES?.host?.create ?? "/host/create"}
            className="inline-flex items-center gap-1.5 border border-neutral-200 hover:border-purple/40 bg-white hover:bg-purple/5 text-neutral-600 hover:text-purple text-xs font-medium px-3.5 py-2 rounded-xl transition-all"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="font-normal">New listing</span>
          </Link>
        }
      />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-5 sm:py-8 md:py-10 space-y-6">
        {/* Verification banner if unverified */}
        {!isHostVerified && (
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-4 shadow-2xs">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-amber-900">Host Verification Required</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900">
                  {user?.verificationStatus ?? "UNVERIFIED"}
                </span>
              </div>
              <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                Your host account is currently unverified. You cannot create new listings or host properties until your identity is verified by the admin team.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Left/Main Column: Today's Operational Schedule Queue */}
          <div className="lg:col-span-2 min-w-0">
            <HostTodaySchedule
              activeTab={scheduleTab}
              onTabChange={setScheduleTab}
              items={scheduleItems}
              onItemsChange={setScheduleItems}
              onSelectBooking={(details) => {
                setSelectedBooking(details);
                setDetailsOpen(true);
              }}
            />
          </div>

          {/* Right Column: Quick Actions */}
          <div className="lg:col-span-1">
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-semibold tracking-normal text-black leading-snug">
                Quick Actions
              </h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 lg:grid-cols-1">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={action.onClick}
                      className="bg-white border border-neutral-200/80 rounded-xl p-2.5 sm:p-3 shadow-2xs hover:border-purple/30 hover:shadow-xs transition-all flex flex-col sm:flex-row items-center gap-2 sm:gap-3 group text-center sm:text-left cursor-pointer outline-none active:scale-98 w-full"
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-purple/10 text-purple border border-purple/15 flex items-center justify-center shrink-0 group-hover:bg-purple group-hover:text-white transition-colors">
                        <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-black truncate">
                          {action.label}
                        </p>
                        <p className="text-[11px] font-normal text-black-muted truncate hidden xs:block sm:block">
                          {action.sublabel}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Booking details dialog */}
      <BookingDetailsDialog
        booking={selectedBooking}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      {/* Quick Block Date dialog */}
      <BlockDateDialog
        open={blockDialogOpen}
        onOpenChange={setBlockDialogOpen}
        listings={myProperties}
      />

      {/* Check In dialog */}
      <CheckInDialog
        open={checkInOpen}
        onOpenChange={setCheckInOpen}
        items={scheduleItems}
        onCheckIn={handleCheckIn}
      />

      {/* Check Out dialog */}
      <CheckOutDialog
        open={checkOutOpen}
        onOpenChange={setCheckOutOpen}
        items={scheduleItems}
        onCheckOut={handleCheckOut}
      />
    </div>
  );
}
