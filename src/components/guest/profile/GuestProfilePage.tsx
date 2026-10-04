"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  Calendar,
  User,
  ChevronRight,
  CheckCircle2,
  Clock,
  Pencil,
  Compass,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AccountSettingsMenu } from "./AccountSettingsMenu";
import { useAuth } from "@/lib/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { getMyBookings } from "@/lib/api/bookings";
import { getMyGuestReviews, type ReviewItemDto } from "@/lib/api/reviews";
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

function TripCard({ trip, onOpen }: { trip: TripItem; onOpen: () => void }) {
  const isUpcoming = trip.status === "upcoming";

  return (
    <div className="bg-[#faf9fc]/40 hover:bg-white border border-neutral-100 hover:border-[#6b2bb8]/30 rounded-xl p-3.5 sm:p-4 transition-all flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between shadow-2xs w-full overflow-hidden">
      <div className="flex items-start gap-3 w-full sm:w-auto flex-1 min-w-0">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-neutral-100 shrink-0 relative border border-black/5">
          <img
            src={trip.image}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-1 left-1 text-[8px] sm:text-[9px] font-semibold bg-black/70 text-white px-1 py-0.5 rounded capitalize leading-none">
            {trip.type}
          </span>
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <h4 className="font-semibold text-sm text-neutral-900 truncate">
              {trip.title}
            </h4>
            <span
              className={cn(
                "inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0",
                isUpcoming
                  ? "text-[#6b2bb8] bg-[#6b2bb8]/10 border-[#6b2bb8]/25"
                  : trip.status === "completed"
                    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                    : "text-neutral-600 bg-neutral-100 border-neutral-200",
              )}
            >
              {isUpcoming ? "Upcoming" : "Completed"}
            </span>
          </div>

          <p className="text-xs text-neutral-500 flex items-center gap-1 min-w-0">
            <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
            <span className="truncate">{trip.location}</span>
          </p>

          <p className="text-xs text-neutral-500 flex items-center gap-1 min-w-0 flex-wrap">
            <Calendar className="w-3 h-3 text-neutral-400 shrink-0" />
            <span className="truncate">{trip.dates}</span>
            <span className="text-neutral-300">·</span>
            <span className="shrink-0">{trip.guests}</span>
          </p>

          <p className="text-xs font-bold text-[#6b2bb8] pt-0.5">
            {trip.price}
          </p>
        </div>
      </div>

      <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100/80">
        <button
          type="button"
          onClick={onOpen}
          className="text-xs font-semibold text-[#6b2bb8] hover:text-white bg-[#6b2bb8]/8 hover:bg-[#6b2bb8] border border-[#6b2bb8]/20 px-3.5 py-1.5 sm:py-2 rounded-xl transition-all flex items-center justify-center gap-1 w-full sm:w-auto text-center cursor-pointer"
        >
          <span>See details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function ProfileSkeletonLoading() {
  return (
    <div className="min-h-screen bg-[#fbfafc] font-sans">
      <main className="max-w-5xl mx-auto w-full px-4 md:px-6 pt-8 md:pt-10 pb-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Overview Card Skeleton */}
            <div className="relative bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs text-center">
              <div className="flex flex-col items-center">
                {/* Avatar skeleton */}
                <div className="w-24 h-24 rounded-full bg-neutral-200/70 animate-pulse mb-3.5 border border-neutral-200/80" />

                {/* Name */}
                <div className="h-6 w-44 bg-neutral-200/80 rounded-lg animate-pulse mb-2.5" />

                {/* Role and Verified Badges */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="h-5 w-20 rounded-full bg-neutral-200/70 animate-pulse" />
                  <div className="h-5 w-24 rounded-full bg-neutral-200/70 animate-pulse" />
                </div>

                {/* Email */}
                <div className="h-3.5 w-48 bg-neutral-200/60 rounded animate-pulse mb-1.5" />

                {/* Member since */}
                <div className="h-3 w-32 bg-neutral-200/50 rounded animate-pulse" />
              </div>

              {/* Stats Strip Skeleton */}
              <div className="grid grid-cols-3 divide-x divide-neutral-100 border-t border-neutral-100 mt-6 pt-5 text-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="h-5 w-8 bg-neutral-200/80 rounded animate-pulse" />
                  <div className="h-3 w-10 bg-neutral-200/50 rounded animate-pulse" />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="h-5 w-12 bg-neutral-200/80 rounded animate-pulse" />
                  <div className="h-3 w-12 bg-neutral-200/50 rounded animate-pulse" />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="h-5 w-8 bg-neutral-200/80 rounded animate-pulse" />
                  <div className="h-3 w-12 bg-neutral-200/50 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Host Banner Skeleton */}
            <div className="bg-neutral-100/70 border border-neutral-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="h-4 w-44 bg-neutral-200/80 rounded animate-pulse" />
                <div className="h-3 w-72 max-w-full bg-neutral-200/60 rounded animate-pulse" />
              </div>
              <div className="h-8 w-28 rounded-full bg-neutral-200/80 animate-pulse shrink-0" />
            </div>

            {/* Activity Tabs & Content Skeleton */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-2xs">
              {/* Tab Header Skeleton */}
              <div className="flex items-center gap-6 border-b border-neutral-100 pb-3 mb-4">
                <div className="h-5 w-28 bg-neutral-200/80 rounded animate-pulse" />
                <div className="h-5 w-24 bg-neutral-200/50 rounded animate-pulse" />
              </div>

              {/* Trip Cards Skeletons */}
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-[#faf9fc]/40 border border-neutral-100 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="flex items-start gap-3 w-full sm:w-auto flex-1 min-w-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-neutral-200/80 animate-pulse shrink-0" />
                      <div className="flex-1 space-y-2 py-0.5 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="h-4 w-40 bg-neutral-200/80 rounded animate-pulse" />
                          <div className="h-4 w-16 rounded-full bg-neutral-200/60 animate-pulse shrink-0" />
                        </div>
                        <div className="h-3 w-28 bg-neutral-200/60 rounded animate-pulse" />
                        <div className="h-3 w-36 bg-neutral-200/60 rounded animate-pulse" />
                        <div className="h-3.5 w-20 bg-neutral-200/80 rounded animate-pulse pt-0.5" />
                      </div>
                    </div>
                    <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100/80">
                      <div className="h-8 w-24 rounded-xl bg-neutral-200/70 animate-pulse ml-auto sm:ml-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Settings Menu Skeleton) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-2xs sticky top-24">
              <div className="mb-4 pb-2 border-b border-neutral-100">
                <div className="h-3.5 w-28 bg-neutral-200/70 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl">
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-neutral-200/70 animate-pulse shrink-0" />
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="h-3.5 w-28 bg-neutral-200/80 rounded animate-pulse" />
                        <div className="h-2.5 w-44 bg-neutral-200/50 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="w-4 h-4 rounded bg-neutral-200/40 animate-pulse ml-2 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function GuestProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrating } = useAuth();
  const { bookings: localBookings } = useBookingStore();

  const [trips, setTrips] = useState<TripItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItemDto[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<"trips" | "reviews">("trips");
  const [selectedTrip, setSelectedTrip] = useState<TripItem | null>(null);

  // Guard route: Only accessible when user is authenticated and DB data is loaded
  useEffect(() => {
    if (isHydrating) return;

    if (!isAuthenticated || !user) {
      router.replace("/auth/login?next=/profile");
      return;
    }

    let isMounted = true;

    async function loadDatabaseData() {
      setIsLoadingData(true);
      try {
        const [apiBookings, apiReviews] = await Promise.all([
          getMyBookings().catch(() => []),
          getMyGuestReviews().catch(() => []),
        ]);

        if (!isMounted) return;

        // Map backend bookings
        const mappedApiTrips: TripItem[] = (apiBookings || []).map((b) => {
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

        // Merge with locally stored bookings (if any)
        const mappedLocalTrips: TripItem[] = (localBookings || []).map((b) => {
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

        // Deduplicate trips by booking reference
        const mergedTrips = [...mappedApiTrips];
        for (const localTrip of mappedLocalTrips) {
          if (!mergedTrips.some((t) => t.bookingRef === localTrip.bookingRef)) {
            mergedTrips.push(localTrip);
          }
        }

        setTrips(mergedTrips);
        setReviews(apiReviews || []);
      } catch (err) {
        console.error("Failed to load profile database data", err);
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    }

    loadDatabaseData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isHydrating, user, router, localBookings]);

  // Average rating calculated strictly from actual reviews
  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return null;
    const sum = reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  // Loading skeleton while authenticating or fetching database records
  if (isHydrating || !isAuthenticated || !user || isLoadingData) {
    return <ProfileSkeletonLoading />;
  }

  // Live user properties from DB
  const displayName = user.name || user.email.split("@")[0];
  const displayEmail = user.email;
  const displayRole = user.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Guest";
  const userInitial = displayName.charAt(0).toUpperCase();
  const isHost = user.role === "host" || user.roles?.includes("host");
  const isVerified = user.isVerified || user.verificationStatus === "VERIFIED";

  const memberSince = user.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#fbfafc] font-sans">
      <main className="max-w-5xl mx-auto w-full px-4 md:px-6 pt-8 md:pt-10 pb-16">
        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Centered Profile Overview Card */}
            <div className="relative bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs text-center">
              {/* Edit Profile button on top right */}
              <Link
                href="/settings/info"
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-xl text-neutral-400 hover:text-purple hover:bg-purple/5 transition-colors border border-transparent hover:border-purple/15 cursor-pointer"
                aria-label="Edit profile"
                title="Edit profile"
              >
                <Pencil className="w-4 h-4" />
              </Link>

              {/* Profile icon in center */}
              <div className="flex flex-col items-center">
                <div className="relative mb-3">
                  <div className="w-24 h-24 rounded-full p-0.5 bg-white border border-neutral-200 shadow-xs flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
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

                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                  {displayName}
                </h2>

                <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
                  <span className="bg-[#6b2bb8]/10 text-[#6b2bb8] text-xs font-semibold px-3 py-0.5 rounded-full border border-[#6b2bb8]/20">
                    {displayRole}
                  </span>

                  {isVerified ? (
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  ) : (
                    <span className="bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Pending Verification
                    </span>
                  )}
                </div>

                {displayEmail && (
                  <p className="text-xs text-neutral-500 mt-2">{displayEmail}</p>
                )}

                <p className="text-xs text-neutral-400 mt-1">
                  Member since {memberSince}
                </p>
              </div>

              {/* Stats Strip - strictly live database data */}
              <div className="grid grid-cols-3 divide-x divide-neutral-100 border-t border-neutral-100 mt-6 pt-5 text-center">
                <div>
                  <span className="text-lg font-bold text-neutral-900">
                    {trips.length}
                  </span>
                  <p className="text-[11px] font-medium text-neutral-500 mt-0.5">
                    Trips
                  </p>
                </div>
                <div>
                  <span className="text-lg font-bold text-neutral-900 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {averageRating ?? "—"}
                  </span>
                  <p className="text-[11px] font-medium text-neutral-500 mt-0.5">
                    Rating
                  </p>
                </div>
                <div>
                  <span className="text-lg font-bold text-neutral-900">
                    {reviews.length}
                  </span>
                  <p className="text-[11px] font-medium text-neutral-500 mt-0.5">
                    Reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Host Banner: Tailored by actual role */}
            {!isHost ? (
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
            ) : (
              <div className="bg-gradient-to-r from-purple-50/50 to-purple-100/30 border border-[#6b2bb8]/15 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#6b2bb8]/10 text-[#6b2bb8] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 text-sm">
                      Host Dashboard
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Manage your listings, calendar, reservations, and payouts.
                    </p>
                  </div>
                </div>
                <Link
                  href="/host"
                  className="bg-[#6b2bb8] hover:bg-[#5a22a0] text-white px-4 py-2 rounded-full text-xs font-medium transition shadow-xs whitespace-nowrap"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}

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
                  Recent trips ({trips.length})
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
                  Reviews ({reviews.length})
                </button>
              </div>

              {/* Content: Real Trips */}
              {activeTab === "trips" && (
                <div className="space-y-3">
                  {trips.length > 0 ? (
                    <>
                      {trips.slice(0, 5).map((trip) => (
                        <TripCard
                          key={trip.id}
                          trip={trip}
                          onOpen={() => setSelectedTrip(trip)}
                        />
                      ))}

                      {trips.length > 5 && (
                        <Link
                          href="/settings/history"
                          className="flex items-center justify-center gap-1.5 w-full py-2.5 mt-4 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition"
                        >
                          <span>See all {trips.length} trips</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </>
                  ) : (
                    <div className="py-10 text-center px-4 rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50">
                      <div className="w-12 h-12 rounded-full bg-[#6b2bb8]/8 text-[#6b2bb8] flex items-center justify-center mx-auto mb-3">
                        <Compass className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-neutral-900">
                        No trips booked yet
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                        Your booked stays, experiences, and transfers will appear here once confirmed.
                      </p>
                      <Link
                        href="/stays"
                        className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-[#6b2bb8] hover:bg-[#5a22a0] text-white text-xs font-semibold transition shadow-xs"
                      >
                        <span>Explore Stays &amp; Escapes</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Content: Real Reviews */}
              {activeTab === "reviews" && (
                <div className="space-y-3">
                  {reviews.length > 0 ? (
                    reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="border border-neutral-100 rounded-xl p-3.5 sm:p-4 bg-[#faf9fc]/40 hover:border-[#6b2bb8]/30 transition"
                      >
                        <div className="flex justify-between items-start mb-1.5">
                          <p className="font-medium text-sm text-neutral-900">
                            {rev.propertyName || rev.listingName || "Verified Booking"}
                          </p>
                          <span className="text-xs font-semibold text-neutral-900 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {rev.rating ? rev.rating.toFixed(1) : "5.0"}
                          </span>
                        </div>
                        {rev.text && (
                          <p className="text-xs text-neutral-600 leading-relaxed">
                            &ldquo;{rev.text}&rdquo;
                          </p>
                        )}
                        <p className="text-[10px] text-neutral-400 mt-2">
                          {rev.createdAt
                            ? new Date(rev.createdAt).toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                              })
                            : "Recent Review"}{" "}
                          · Verified Stay
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center px-4 rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50">
                      <div className="w-12 h-12 rounded-full bg-[#6b2bb8]/8 text-[#6b2bb8] flex items-center justify-center mx-auto mb-3">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-neutral-900">
                        No reviews submitted yet
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                        Once you complete a trip and submit a review for your host, it will be listed here.
                      </p>
                    </div>
                  )}
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

      {/* Trip Details Dialog */}
      <Dialog
        open={!!selectedTrip}
        onOpenChange={(open) => !open && setSelectedTrip(null)}
      >
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
                      {selectedTrip.status === "completed"
                        ? "Completed"
                        : "Upcoming"}
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
                    <p className="text-neutral-400 text-[11px] font-medium">
                      Booking Reference
                    </p>
                    <p className="font-semibold text-neutral-900 mt-0.5">
                      {selectedTrip.bookingRef}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-[11px] font-medium">
                      Total Amount
                    </p>
                    <p className="font-semibold text-[#6b2bb8] mt-0.5">
                      {selectedTrip.price}
                    </p>
                  </div>
                </div>

                {/* Info List */}
                <div className="space-y-3 text-xs text-neutral-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-neutral-400 text-[11px]">Location</p>
                      <p className="text-neutral-900 font-medium">
                        {selectedTrip.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-neutral-400 text-[11px]">
                        Dates &amp; Schedule
                      </p>
                      <p className="text-neutral-900 font-medium">
                        {selectedTrip.dates}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-neutral-400 text-[11px]">
                        Party / Guests
                      </p>
                      <p className="text-neutral-900 font-medium">
                        {selectedTrip.guests}
                      </p>
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
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium rounded-xl transition cursor-pointer"
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
