"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bed,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  Clock,
  Eye,
  Pencil,
  Ticket,
  UserCheck,
  UserMinus,
  Users,
} from "lucide-react";
import { HostPageHeader } from "@/components/layout/HostPageHeader";
import { ROUTES } from "@/lib/constants/routes";
import { mockHostProfile } from "@/lib/mock-profile-data";
import { mockOperationalQueue } from "@/lib/mock-host-dashboard";
import { mockHostBookings } from "@/lib/mock-host-bookings";
import { useNotificationStore } from "@/store/notificationStore";
import { cn } from "@/lib/utils";
import { BookingDetailsDialog } from "./BookingDetailsDialog";
import type { BookingDetailsData } from "./BookingDetailsDialog";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function HostDashboardPage() {
  const host = mockHostProfile;
  const [mounted, setMounted] = useState(false);
  const { getUnreadCount } = useNotificationStore();
  const unread = getUnreadCount();

  // The unread count comes from a persisted store that rehydrates from
  // localStorage on the client, and the greeting depends on the local clock.
  // Defer both until after hydration so the server HTML always matches the
  // client's first render.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Upcoming activities — check-ins/outs + upcoming bookings, sorted by date
  const upcomingActivities = [
    ...mockOperationalQueue
      .filter((q) => q.type !== "hosting")
      .map((q) => ({
        id: q.id,
        kind: q.type === "arriving" ? ("checkin" as const) : ("checkout" as const),
        guest: q.guestName,
        listing: q.listingName,
        listingImage: q.listingImage,
        date: q.checkIn ?? q.checkOut ?? "",
        meta: q.type === "arriving" ? "Arriving" : "Checking out",
        guests: q.guests,
        status: q.status,
      })),
    ...mockHostBookings
      .filter((b) => b.status === "confirmed" || b.status === "pending")
      .map((b) => ({
        id: b.id,
        kind: b.listingType === "stay" ? ("stay" as const) : ("activity" as const),
        listingType: b.listingType as BookingDetailsData["listingType"],
        guest: b.guestName,
        listing: b.listingName,
        listingImage: b.listingImage,
        date: b.checkIn ?? b.date ?? "",
        meta:
          b.listingType === "stay"
            ? "Stay"
            : b.listingType === "experience"
              ? "Experience"
              : "Transfer",
        guests: b.guests,
        status: b.status,
        amount: b.amount,
        currency: b.currency,
      })),
  ]
    .filter((a) => a.date)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);

  // Map an upcoming activity to the shared booking-details shape
  const activityToDetails = (a: (typeof upcomingActivities)[number]): BookingDetailsData => ({
    id: a.id,
    listingName: a.listing,
    listingImage: a.listingImage,
    listingType: "listingType" in a ? a.listingType : "stay",
    status: a.status,
    guestName: a.guest,
    guests: a.guests,
    date: a.date,
    amount: "amount" in a ? a.amount : undefined,
    currency: "currency" in a ? a.currency : undefined,
  });

  const [selectedActivity, setSelectedActivity] = useState<
    (typeof upcomingActivities)[number] | null
  >(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Quick actions — the most frequent host tasks: block tour slots, then
  // check guests in and out from today's operations.

  const quickActions = [
    {
      href: ROUTES.host.availability,
      icon: CalendarDays,
      label: "Block dates",
      desc: "Close dates on your availability calendar",
    },
    {
      href: ROUTES.host.bookings,
      icon: UserCheck,
      label: "Check in guest",
      desc: "Check guests into today's tours",
    },
    {
      href: ROUTES.host.bookings,
      icon: UserMinus,
      label: "Check out guest",
      desc: "Mark guests as checked out",
    },
    {
      href: ROUTES.host.listings,
      icon: Pencil,
      label: "Update listings",
      desc: "Update photos, prices and details",
    },
  ];

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-ZM", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="min-h-screen bg-neutral-50">
      <HostPageHeader
        title={`${mounted ? greeting() : "Hello"}, ${host.name.split(" ")[0]}`}
        description="Here's what needs your attention today."
      />

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8 space-y-10">
        {/* Host summary */}
        <section className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-lg font-bold text-neutral-600">
              {host.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-neutral-900 truncate">{host.name}</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                {host.rating.toFixed(2)} rating · {host.responseRate}% response
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center border-t border-neutral-100 pt-4">
            <div>
              <p className="text-base font-black text-purple">
                K{host.totalRevenue.toLocaleString()}
              </p>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">
                Earned
              </p>
            </div>
            <div>
              <p className="text-base font-black text-purple">{host.totalBookings}</p>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">
                Bookings
              </p>
            </div>
            <div>
              <p className="text-base font-black text-purple">{host.listings.length}</p>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">
                Listings
              </p>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-lg md:text-xl font-bold tracking-tight text-neutral-900 leading-[1.15]">
                Quick Actions
              </h2>
            </div>
            {mounted && unread > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple/10 text-purple text-xs font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-purple" />
                {unread} unread notification{unread > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map(({ href, icon: Icon, label, desc }) => (
              <Link
                key={label}
                href={href}
                className="group flex items-center gap-3 bg-white border border-neutral-200 rounded-xl px-4 py-3.5 shadow-sm hover:border-purple/40 hover:shadow-md transition-all"
              >
                <div className="h-10 w-10 shrink-0 rounded-lg bg-purple/10 text-purple flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-neutral-900 truncate">{label}</h3>
                  <p className="text-xs text-neutral-500 mt-0.5 truncate">{desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-300 shrink-0 transition-all duration-200 group-hover:text-purple group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>

        <div className="space-y-8">
            {/* Upcoming activities */}
            <section className="space-y-5">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="font-display text-lg md:text-xl font-bold tracking-tight text-neutral-900 leading-[1.15]">
                    Upcoming Activities
                  </h2>
                  <p className="text-neutral-500 mt-1 text-sm">
                    Check-ins, check-outs and confirmed experiences
                  </p>
                </div>
                <Link
                  href="/host/bookings"
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-700 hover:text-purple transition-colors group"
                >
                  <span>All bookings</span>
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden divide-y divide-neutral-100">
                {upcomingActivities.length === 0 ? (
                  <div className="p-8 text-center">
                    <Clock className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                    <p className="text-sm text-neutral-500">Nothing scheduled in the coming days</p>
                  </div>
                ) : (
                  upcomingActivities.map((a) => {
                    const Icon =
                      a.kind === "checkin"
                        ? CalendarCheck
                        : a.kind === "checkout"
                          ? CalendarDays
                          : a.kind === "stay"
                            ? Bed
                            : Ticket;
                    return (
                      <div
                        key={a.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-neutral-50 transition-colors"
                      >
                        <button
                          onClick={() => {
                            setSelectedActivity(a);
                            setDetailsOpen(true);
                          }}
                          aria-label={`View details for ${a.guest}`}
                          className="flex items-center gap-3.5 flex-1 min-w-0 text-left outline-none"
                        >
                          <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center text-sm font-bold shrink-0">
                            {a.guest
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-neutral-900 truncate">
                              {a.guest}
                            </div>
                            <div className="text-xs text-neutral-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                              <span className="font-medium text-neutral-900">
                                {formatDate(a.date)}
                              </span>
                              <span className="text-neutral-300">·</span>
                              <span>{a.listing}</span>
                              <span className="text-neutral-300">·</span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {a.guests}
                              </span>
                            </div>
                          </div>
                        </button>
                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                              a.kind === "checkin"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : a.kind === "checkout"
                                  ? "bg-neutral-100 text-neutral-600 border-neutral-200"
                                  : a.status === "pending"
                                    ? "bg-purple/10 text-purple border-purple/20"
                                    : "bg-neutral-100 text-neutral-600 border-neutral-200",
                            )}
                          >
                            <Icon className="h-3 w-3" />
                            {a.meta}
                          </span>
                          {"amount" in a && a.amount != null && (
                            <span className="text-sm font-bold text-neutral-900">
                              K{a.amount.toLocaleString()}
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setSelectedActivity(a);
                              setDetailsOpen(true);
                            }}
                            aria-label={`View details for ${a.guest}`}
                            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-purple hover:border-purple/40 hover:bg-purple/5 transition-colors outline-none"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View details
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>

      </div>

      {/* Activity details dialog */}
      <BookingDetailsDialog
        booking={selectedActivity ? activityToDetails(selectedActivity) : null}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
}
