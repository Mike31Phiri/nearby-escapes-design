"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Hotel,
  Ticket,
  Bus,
  Compass,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileSubpageHeader } from "./ProfileSubpageHeader";
import { useAuth } from "@/lib/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { getMyBookings, type BookingDTO } from "@/lib/api/bookings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface HistoryTripItem {
  id: string;
  bookingRef: string;
  type: string;
  title: string;
  location: string;
  image: string;
  dates: string;
  guests: string;
  price: string;
  status: "completed" | "upcoming" | "confirmed" | "cancelled";
  customerName?: string;
  hostName?: string;
}

export function TripHistoryPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrating } = useAuth();
  const { bookings: localBookings } = useBookingStore();

  const [trips, setTrips] = useState<HistoryTripItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");
  const [selectedTrip, setSelectedTrip] = useState<HistoryTripItem | null>(null);

  useEffect(() => {
    if (isHydrating) return;
    if (!isAuthenticated) {
      router.replace("/auth/login?next=/settings/history");
      return;
    }

    let isMounted = true;

    async function loadTrips() {
      setIsLoading(true);
      try {
        const apiBookings = await getMyBookings().catch(() => []);

        if (!isMounted) return;

        const mappedApiTrips: HistoryTripItem[] = (apiBookings || []).map((b) => {
          const checkIn = b.checkIn || b.date;
          const isUpcoming =
            b.status === "confirmed" && checkIn
              ? new Date(checkIn) >= new Date()
              : false;

          return {
            id: b.id || b.bookingRef,
            bookingRef: b.bookingRef,
            type: b.vertical || "stay",
            title: b.listingTitle || "Reservation",
            location: "Zambia",
            image:
              "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
            dates: checkIn || "Scheduled",
            guests: `${b.guests} Guest${b.guests > 1 ? "s" : ""}`,
            price: `ZMW ${(b.totalNgwee / 100).toLocaleString()}`,
            status: isUpcoming
              ? "upcoming"
              : b.status === "completed"
                ? "completed"
                : b.status === "cancelled"
                  ? "cancelled"
                  : "completed",
          };
        });

        const mappedLocalTrips: HistoryTripItem[] = (localBookings || []).map((b) => {
          const checkIn = b.details?.checkIn;
          const isUpcoming =
            b.status === "confirmed" && checkIn
              ? new Date(checkIn) >= new Date()
              : false;

          return {
            id: b.bookingRef || b.id,
            bookingRef: b.bookingRef || "NE-CONFIRMED",
            type: b.type || "stay",
            title: b.listingName || "Booking",
            location: b.location || "Zambia",
            image:
              b.image ||
              "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
            dates: checkIn || b.details?.date || "Recent booking",
            guests: b.details?.guests
              ? `${b.details.guests} Guest${b.details.guests > 1 ? "s" : ""}`
              : "1 Guest",
            price: `${b.currency || "ZMW"} ${(b.amount || 0).toLocaleString()}`,
            status: isUpcoming
              ? "upcoming"
              : b.status === "cancelled"
                ? "cancelled"
                : "completed",
            customerName: b.customerName,
            hostName: b.hostName,
          };
        });

        // Merge & deduplicate by booking reference
        const merged = [...mappedApiTrips];
        for (const lt of mappedLocalTrips) {
          if (!merged.some((m) => m.bookingRef === lt.bookingRef)) {
            merged.push(lt);
          }
        }

        setTrips(merged);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTrips();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isHydrating, router, localBookings]);

  const filteredTrips = useMemo(() => {
    if (filter === "all") return trips;
    return trips.filter((t) => t.status === filter);
  }, [trips, filter]);

  const counts = useMemo(
    () => ({
      all: trips.length,
      upcoming: trips.filter((t) => t.status === "upcoming").length,
      completed: trips.filter((t) => t.status === "completed").length,
      cancelled: trips.filter((t) => t.status === "cancelled").length,
    }),
    [trips],
  );

  const getVerticalBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "experience":
        return {
          icon: Ticket,
          label: "Experience",
          className: "bg-purple/10 text-purple border-purple/20",
        };
      case "transport":
        return {
          icon: Bus,
          label: "Transport",
          className: "bg-amber-50 text-amber-700 border-amber-200",
        };
      default:
        return {
          icon: Hotel,
          label: "Stay",
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
    }
  };

  if (isHydrating || !isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-[#fbfafc] flex flex-col">
        <ProfileSubpageHeader title="Trip history" />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-9 h-9 border-3 border-[#6b2bb8]/25 border-t-[#6b2bb8] rounded-full animate-spin mb-3" />
          <p className="text-xs text-neutral-500 font-medium">
            Loading your reservations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfafc] font-sans pb-16">
      <ProfileSubpageHeader title="Trip history" />

      <main className="max-w-4xl mx-auto w-full px-4 md:px-6 pt-6 md:pt-8 space-y-6">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-3 overflow-x-auto">
          {(
            [
              { id: "all", label: "All Trips", count: counts.all },
              { id: "upcoming", label: "Upcoming", count: counts.upcoming },
              { id: "completed", label: "Completed", count: counts.completed },
              { id: "cancelled", label: "Cancelled", count: counts.cancelled },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
                filter === tab.id
                  ? "bg-[#6b2bb8] text-white shadow-2xs font-semibold"
                  : "bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/80 hover:bg-neutral-50",
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded-full",
                  filter === tab.id ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500",
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Trips List */}
        {filteredTrips.length > 0 ? (
          <div className="space-y-3.5">
            {filteredTrips.map((trip) => {
              const badge = getVerticalBadge(trip.type);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={trip.id}
                  className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs hover:border-[#6b2bb8]/30 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/70">
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1",
                            badge.className,
                          )}
                        >
                          <BadgeIcon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                        <span className="text-[11px] font-mono text-neutral-400">
                          {trip.bookingRef}
                        </span>
                      </div>

                      <h3 className="font-semibold text-sm sm:text-base text-neutral-900 truncate">
                        {trip.title}
                      </h3>

                      <p className="text-xs text-neutral-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate">{trip.location}</span>
                      </p>

                      <p className="text-xs text-neutral-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>{trip.dates}</span>
                        <span className="text-neutral-300">·</span>
                        <span>{trip.guests}</span>
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                    <span
                      className={cn(
                        "text-xs font-semibold px-2.5 py-0.5 rounded-full border",
                        trip.status === "upcoming"
                          ? "bg-[#6b2bb8]/10 text-[#6b2bb8] border-[#6b2bb8]/25"
                          : trip.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200",
                      )}
                    >
                      {trip.status === "upcoming"
                        ? "Upcoming"
                        : trip.status === "completed"
                          ? "Completed"
                          : "Cancelled"}
                    </span>

                    <p className="text-sm font-bold text-neutral-900">{trip.price}</p>

                    <button
                      type="button"
                      onClick={() => setSelectedTrip(trip)}
                      className="text-xs font-semibold text-[#6b2bb8] hover:underline flex items-center gap-0.5 cursor-pointer mt-0.5"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center px-4 rounded-2xl border border-dashed border-neutral-200 bg-white">
            <div className="w-12 h-12 rounded-full bg-[#6b2bb8]/8 text-[#6b2bb8] flex items-center justify-center mx-auto mb-3">
              <Compass className="w-6 h-6" />
            </div>
            <p className="text-base font-semibold text-neutral-900">
              No {filter !== "all" ? filter : ""} trips found
            </p>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              {filter === "all"
                ? "You haven't booked any trips yet. Discover hand-picked lodges, safaris, and tours across Zambia."
                : `You currently have no ${filter} bookings recorded in your account.`}
            </p>
            <Link
              href="/stays"
              className="inline-flex items-center gap-1.5 mt-5 px-5 py-2.5 rounded-xl bg-[#6b2bb8] hover:bg-[#5a22a0] text-white text-xs font-semibold transition shadow-xs"
            >
              <span>Explore Stays &amp; Escapes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </main>

      {/* Details Dialog */}
      <Dialog open={!!selectedTrip} onOpenChange={(open) => !open && setSelectedTrip(null)}>
        <DialogContent
          overlayClassName="backdrop-blur-sm bg-black/50"
          className="sm:max-w-lg p-0 overflow-hidden bg-white border border-neutral-200 rounded-2xl shadow-xl"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Trip: {selectedTrip?.title}</DialogTitle>
            <DialogDescription>Details for reservation {selectedTrip?.bookingRef}</DialogDescription>
          </DialogHeader>

          {selectedTrip && (
            <div>
              <div className="relative h-44 w-full bg-neutral-100">
                <img
                  src={selectedTrip.image}
                  alt={selectedTrip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-semibold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded capitalize">
                    {selectedTrip.type}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 leading-snug">
                    {selectedTrip.title}
                  </h3>
                </div>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div>
                    <p className="text-neutral-400 text-[11px]">Booking Reference</p>
                    <p className="font-semibold text-neutral-900 mt-0.5">
                      {selectedTrip.bookingRef}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-[11px]">Total Paid</p>
                    <p className="font-semibold text-[#6b2bb8] mt-0.5">{selectedTrip.price}</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-neutral-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>{selectedTrip.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>{selectedTrip.dates}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>{selectedTrip.guests}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedTrip(null)}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl font-medium transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
