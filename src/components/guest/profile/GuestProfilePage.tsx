"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, MapPin, Calendar, User, ChevronRight, CheckCircle2, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccountSettingsMenu } from "./AccountSettingsMenu";
import { useAuth } from "@/lib/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TripItem {
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

export function GuestProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { bookings } = useBookingStore();
  const [activeTab, setActiveTab] = useState<"trips" | "reviews">("trips");
  const [selectedTrip, setSelectedTrip] = useState<TripItem | null>(null);

  // Display user details with sensible fallbacks
  const displayName = user?.name || (isAuthenticated ? "Guest Traveler" : "Alex Smith");
  const displayEmail = user?.email || (isAuthenticated ? "" : "alex.smith@example.com");
  const displayRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Guest";
  const userInitial = displayName.charAt(0).toUpperCase();

  // Booking stats
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const tripsCount = confirmedBookings.length > 0 ? confirmedBookings.length : 12;

  // Rich demo trips with all required details
  const demoTrips: TripItem[] = [
    {
      id: "demo-1",
      bookingRef: "NE-82914",
      type: "stay",
      title: "Chisanga's Lakeside Lodge",
      location: "Livingstone, Southern Province",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
      dates: "12 Aug – 15 Aug 2025",
      guests: "2 Guests",
      price: "ZMW 3,450",
      status: "completed",
    },
    {
      id: "demo-2",
      bookingRef: "NE-90412",
      type: "experience",
      title: "Mosi-oa-Tunya Safari & River Cruise",
      location: "Livingstone, Southern Province",
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80",
      dates: "18 Jan 2026",
      guests: "1 Guest",
      price: "ZMW 1,800",
      status: "upcoming",
    },
    {
      id: "demo-3",
      bookingRef: "NE-61904",
      type: "transport",
      title: "Lusaka to Livingstone Express Coach",
      location: "Intercity Bus Terminal, Lusaka",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80",
      dates: "28 Dec 2025",
      guests: "2 Passengers",
      price: "ZMW 750",
      status: "completed",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fbfafc] font-sans">
      <main className="max-w-5xl mx-auto w-full px-4 md:px-6 pt-8 md:pt-10 pb-16">
        {/* Header without auth links */}
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">Profile</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Manage your personal info, travel history, and account settings
          </p>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Centered Profile Overview Card */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs text-center">
              {/* Profile icon in center */}
              <div className="flex flex-col items-center">
                <div className="relative mb-3">
                  <div className="w-24 h-24 rounded-full p-0.5 bg-white border border-neutral-200 shadow-xs flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        className="w-full h-full rounded-full object-cover"
                        alt={displayName}
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-[#6b2bb8]/10 text-[#6b2bb8] flex items-center justify-center font-bold text-2xl">
                        {userInitial || <User className="w-10 h-10" />}
                      </div>
                    )}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">{displayName}</h2>

                <div className="mt-1.5 flex items-center justify-center gap-2">
                  <span className="bg-[#6b2bb8]/10 text-[#6b2bb8] text-xs font-medium px-3 py-0.5 rounded-full border border-[#6b2bb8]/20">
                    {displayRole}
                  </span>
                </div>

                {displayEmail && <p className="text-xs text-neutral-500 mt-1.5">{displayEmail}</p>}

                <p className="text-xs text-neutral-400 mt-1">
                  Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : "2024"} ·
                  Verified Guest
                </p>

                <Link
                  href="/settings/info"
                  className="text-xs font-medium text-[#6b2bb8] hover:text-[#5a22a0] hover:underline mt-2.5 inline-block"
                >
                  Edit profile
                </Link>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 divide-x divide-neutral-100 border-t border-neutral-100 mt-6 pt-5 text-center">
                <div>
                  <span className="text-lg font-bold text-neutral-900">{tripsCount}</span>
                  <p className="text-[11px] font-medium text-neutral-500 mt-0.5">Trips</p>
                </div>
                <div>
                  <span className="text-lg font-bold text-neutral-900 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9
                  </span>
                  <p className="text-[11px] font-medium text-neutral-500 mt-0.5">Rating</p>
                </div>
                <div>
                  <span className="text-lg font-bold text-neutral-900">8</span>
                  <p className="text-[11px] font-medium text-neutral-500 mt-0.5">Reviews</p>
                </div>
              </div>
            </div>

            {/* Become a Host Banner */}
            <div className="bg-gradient-to-r from-[#f9f5fd] to-[#f3ebfa] border border-[#6b2bb8]/15 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-neutral-900 text-sm">
                  Share your space, earn extra income
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  List your guest house, safari lodge, tour, or transport on Nearby Escapes.
                </p>
              </div>
              <Link
                href="/become-host"
                className="bg-[#6b2bb8] hover:bg-[#5a22a0] text-white px-4 py-2 rounded-full text-xs font-medium transition shadow-xs whitespace-nowrap"
              >
                Become a host
              </Link>
            </div>

            {/* Activity Tabs */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-2xs">
              <div className="flex items-center gap-6 border-b border-neutral-100 pb-3 mb-4">
                <button
                  onClick={() => setActiveTab("trips")}
                  className={cn(
                    "text-sm font-medium transition-colors relative pb-1",
                    activeTab === "trips"
                      ? "text-[#6b2bb8] font-semibold after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-[2px] after:bg-[#6b2bb8]"
                      : "text-neutral-500 hover:text-neutral-800",
                  )}
                >
                  Recent trips
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={cn(
                    "text-sm font-medium transition-colors relative pb-1",
                    activeTab === "reviews"
                      ? "text-[#6b2bb8] font-semibold after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-[2px] after:bg-[#6b2bb8]"
                      : "text-neutral-500 hover:text-neutral-800",
                  )}
                >
                  Reviews (2)
                </button>
              </div>

              {/* Content: Trips */}
              {activeTab === "trips" && (
                <div className="space-y-3">
                  {bookings.length > 0
                    ? bookings.slice(0, 3).map((b) => {
                        const tripType = b.type || "stay";
                        const checkIn = b.details?.checkIn;
                        const checkOut = b.details?.checkOut;
                        const dateStr = checkIn
                          ? checkOut
                            ? `${checkIn} – ${checkOut}`
                            : checkIn
                          : b.details?.date || "Recent booking";
                        const guestsStr = b.details?.guests
                          ? `${b.details.guests} Guest${b.details.guests > 1 ? "s" : ""}`
                          : "1 Guest";
                        const priceStr = `${b.currency || "ZMW"} ${(b.amount || 0).toLocaleString()}`;
                        const isUpcoming =
                          b.status === "confirmed" && checkIn
                            ? new Date(checkIn) >= new Date()
                            : false;

                        const tripData: TripItem = {
                          id: b.bookingRef || b.id,
                          bookingRef: b.bookingRef || "NE-CONFIRMED",
                          type: tripType,
                          title: b.listingName || "Booking",
                          location: b.location || "Zambia",
                          image:
                            b.image ||
                            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
                          dates: dateStr,
                          guests: guestsStr,
                          price: priceStr,
                          status: isUpcoming
                            ? "upcoming"
                            : b.status === "confirmed"
                              ? "completed"
                              : "completed",
                          customerName: b.customerName,
                          hostName: b.hostName,
                        };

                        return (
                          <div
                            key={b.bookingRef || b.id}
                            className="bg-white border border-neutral-200/80 rounded-xl p-3.5 sm:p-4 hover:border-[#6b2bb8]/30 transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-2xs"
                          >
                            <div className="flex items-start gap-3.5 min-w-0">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-neutral-100 shrink-0 relative">
                                <img
                                  src={tripData.image}
                                  alt={tripData.title}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute bottom-1 left-1 text-[9px] font-semibold bg-black/65 text-white px-1.5 py-0.5 rounded capitalize">
                                  {tripType}
                                </span>
                              </div>
                              <div className="min-w-0 space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-sm text-neutral-900 truncate">
                                    {tripData.title}
                                  </p>
                                  <span
                                    className={cn(
                                      "text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0",
                                      isUpcoming
                                        ? "text-[#6b2bb8] bg-[#6b2bb8]/10 border-[#6b2bb8]/25"
                                        : b.status === "confirmed"
                                          ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                          : "text-neutral-600 bg-neutral-100 border-neutral-200",
                                    )}
                                  >
                                    {isUpcoming
                                      ? "Upcoming"
                                      : b.status === "confirmed"
                                        ? "Completed"
                                        : b.status}
                                  </span>
                                </div>
                                <p className="text-xs text-neutral-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                                  <span className="truncate">{tripData.location}</span>
                                </p>
                                <p className="text-xs text-neutral-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-neutral-400 shrink-0" />
                                  <span>{dateStr}</span>
                                  <span>·</span>
                                  <span>{guestsStr}</span>
                                </p>
                                <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-0.5">
                                  <span>Ref: {tripData.bookingRef}</span>
                                  <span>·</span>
                                  <span className="font-medium text-neutral-700">{priceStr}</span>
                                </div>
                              </div>
                            </div>

                            {/* See Details opens popup modal */}
                            <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                              <button
                                type="button"
                                onClick={() => setSelectedTrip(tripData)}
                                className="text-xs font-semibold text-[#6b2bb8] hover:text-white bg-[#6b2bb8]/8 hover:bg-[#6b2bb8] border border-[#6b2bb8]/20 px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1 w-full sm:w-auto text-center"
                              >
                                <span>See details</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    : demoTrips.map((trip) => (
                        <div
                          key={trip.id}
                          className="bg-white border border-neutral-200/80 rounded-xl p-3.5 sm:p-4 hover:border-[#6b2bb8]/30 transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-2xs"
                        >
                          <div className="flex items-start gap-3.5 min-w-0">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-neutral-100 shrink-0 relative">
                              <img
                                src={trip.image}
                                alt={trip.title}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute bottom-1 left-1 text-[9px] font-semibold bg-black/65 text-white px-1.5 py-0.5 rounded capitalize">
                                {trip.type}
                              </span>
                            </div>
                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-sm text-neutral-900 truncate">
                                  {trip.title}
                                </p>
                                <span
                                  className={cn(
                                    "text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0",
                                    trip.status === "completed"
                                      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                      : "text-[#6b2bb8] bg-[#6b2bb8]/10 border-[#6b2bb8]/25",
                                  )}
                                >
                                  {trip.status === "completed" ? "Completed" : "Upcoming"}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                                <span className="truncate">{trip.location}</span>
                              </p>
                              <p className="text-xs text-neutral-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-neutral-400 shrink-0" />
                                <span>{trip.dates}</span>
                                <span>·</span>
                                <span>{trip.guests}</span>
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-0.5">
                                <span>Ref: {trip.bookingRef}</span>
                                <span>·</span>
                                <span className="font-medium text-neutral-700">{trip.price}</span>
                              </div>
                            </div>
                          </div>

                          {/* See Details opens popup modal */}
                          <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                            <button
                              type="button"
                              onClick={() => setSelectedTrip(trip)}
                              className="text-xs font-semibold text-[#6b2bb8] hover:text-white bg-[#6b2bb8]/8 hover:bg-[#6b2bb8] border border-[#6b2bb8]/20 px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1 w-full sm:w-auto text-center"
                            >
                              <span>See details</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                  {/* See all button for trips */}
                  <Link
                    href="/settings/history"
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 mt-4 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition"
                  >
                    <span>See all trips</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Content: Reviews */}
              {activeTab === "reviews" && (
                <div className="space-y-3">
                  <div className="border border-neutral-100 rounded-xl p-3.5 sm:p-4 bg-[#faf9fc]/40 hover:border-[#6b2bb8]/30 transition">
                    <div className="flex justify-between items-start mb-1.5">
                      <p className="font-medium text-sm text-neutral-900">
                        Chisanga&apos;s Lakeside Lodge
                      </p>
                      <span className="text-xs font-semibold text-neutral-900 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 5.0
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      &ldquo;The chalet was spotless, right by the water, and the staff made sure we
                      had everything we needed for an amazing sunset.&rdquo;
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-2">August 2025 · Verified Stay</p>
                  </div>

                  <div className="border border-neutral-100 rounded-xl p-3.5 sm:p-4 bg-[#faf9fc]/40 hover:border-[#6b2bb8]/30 transition">
                    <div className="flex justify-between items-start mb-1.5">
                      <p className="font-medium text-sm text-neutral-900">
                        Mosi-oa-Tunya Guided Safari
                      </p>
                      <span className="text-xs font-semibold text-neutral-900 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.8
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      &ldquo;Kapasa was an exceptional guide! We were able to see white rhinos up
                      close and got great photos.&rdquo;
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-2">
                      January 2026 · Verified Tour
                    </p>
                  </div>

                  {/* See all button for reviews */}
                  <Link
                    href="/trips"
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 mt-4 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition"
                  >
                    <span>See all reviews</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (Settings Menu) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-2xs sticky top-24">
              <div className="mb-3 pb-2 border-b border-neutral-100">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider text-[11px] text-neutral-400">
                  Account Settings
                </h3>
              </div>
              <AccountSettingsMenu />
            </div>
          </div>
        </div>
      </main>

      <Dialog open={!!selectedTrip} onOpenChange={(open) => !open && setSelectedTrip(null)}>
        <DialogContent
          overlayClassName="backdrop-blur-sm bg-black/50"
          className="sm:max-w-lg p-0 overflow-hidden bg-white border border-neutral-200 rounded-2xl shadow-xl"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Trip Details: {selectedTrip?.title}</DialogTitle>
            <DialogDescription>
              Details and reservation summary for {selectedTrip?.bookingRef}
            </DialogDescription>
          </DialogHeader>

          {selectedTrip && (
            <div>
              {/* Image banner with overlay */}
              <div className="relative h-48 w-full bg-neutral-100">
                <img
                  src={selectedTrip.image}
                  alt={selectedTrip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white capitalize">
                      {selectedTrip.type}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-medium px-2 py-0.5 rounded-full border",
                        selectedTrip.status === "completed"
                          ? "bg-emerald-500/25 text-emerald-200 border-emerald-400/40"
                          : "bg-[#6b2bb8]/35 text-purple-200 border-purple-300/40",
                      )}
                    >
                      {selectedTrip.status === "completed" ? "Completed" : "Upcoming"}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {selectedTrip.title}
                  </h3>
                </div>
              </div>

              {/* Body Details */}
              <div className="p-5 space-y-4">
                {/* Reference and price summary box */}
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 text-xs">
                  <div>
                    <p className="text-neutral-400 text-[11px] font-medium">Booking Reference</p>
                    <p className="font-semibold text-neutral-900 mt-0.5">
                      {selectedTrip.bookingRef}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-[11px] font-medium">Total Amount</p>
                    <p className="font-semibold text-[#6b2bb8] mt-0.5">{selectedTrip.price}</p>
                  </div>
                </div>

                {/* Info List */}
                <div className="space-y-3 text-xs text-neutral-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-neutral-400 text-[11px]">Location</p>
                      <p className="text-neutral-900 font-medium">{selectedTrip.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-neutral-400 text-[11px]">Dates &amp; Schedule</p>
                      <p className="text-neutral-900 font-medium">{selectedTrip.dates}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-neutral-400 text-[11px]">Party / Guests</p>
                      <p className="text-neutral-900 font-medium">{selectedTrip.guests}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3.5 border-t border-neutral-100 flex items-center justify-between gap-3">
                  <Link
                    href="/settings/history"
                    onClick={() => setSelectedTrip(null)}
                    className="text-xs font-semibold text-[#6b2bb8] hover:text-[#5a22a0] hover:underline"
                  >
                    View in Trip History →
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSelectedTrip(null)}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium rounded-xl transition"
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
