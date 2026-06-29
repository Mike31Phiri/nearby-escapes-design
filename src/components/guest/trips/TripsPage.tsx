"use client";

import { useMemo, useCallback, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Hotel,
  Ticket,
  Bus,
  Compass,
  ArrowRight,
  ArrowUpRight,
  Ban,
  Star,
  Gem,
  Map as MapIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useBookingStore, type ConfirmedBooking } from "@/store/bookingStore";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ReviewDialog } from "@/components/guest/reviews/ReviewDialog";
import { useAuth } from "@/lib/store/authStore";

//Stats Card ──────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="group bg-white border border-gray-100 rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center border", color)}>
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>
      </div>
      <p className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

//Booking Type Icon ───────────────────────────────────────────────────

const typeIcons = {
  stay: Hotel,
  experience: Ticket,
  transport: Bus,
  gem: Gem,
} as const;

const typeLabels = {
  stay: "Stay",
  experience: "Experience",
  transport: "Transport",
  gem: "Hidden Gem",
} as const;

//Booking Card ────────────────────────────────────────────────────────

function BookingCard({
  booking,
  onCancel,
  onReview,
}: {
  booking: ConfirmedBooking;
  onCancel: (ref: string) => void;
  onReview: (booking: ConfirmedBooking) => void;
}) {
  const TypeIcon = typeIcons[booking.type];

  const isUpcoming =
    booking.status === "confirmed" &&
    (() => {
      const now = new Date();
      const bookingDate = booking.details.checkIn || booking.details.date || "";
      return bookingDate ? new Date(bookingDate) >= now : true;
    })();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-ZM", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const listingHref = `/listings/${
    booking.type === "stay" ? "stays" : booking.type === "experience" ? "experiences" : "transport"
  }/${booking.listingId}`;

  return (
    <div className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative h-32 w-full sm:h-auto sm:w-44 shrink-0 overflow-hidden bg-gray-100">
          <img
            src={booking.image}
            alt={booking.listingName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent sm:bg-gradient-to-r sm:from-black/40 sm:to-transparent" />
          {/* Type badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-black/50 backdrop-blur-sm px-2 py-1 text-[9px] font-bold text-white uppercase tracking-wider border border-white/10">
            <TypeIcon className="h-3 w-3" />
            <span>{typeLabels[booking.type]}</span>
          </div>
          {/* Status pill */}
          {booking.status === "cancelled" && (
            <div className="absolute top-2 right-2 rounded-full bg-rose-500/90 px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
              Cancelled
            </div>
          )}
          {booking.status === "confirmed" && !isUpcoming && (
            <div className="absolute top-2 right-2 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
              Completed
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 p-4 md:p-5 space-y-3">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={listingHref}
                  className="text-sm font-bold text-gray-900 hover:text-[#1A0B2E] transition-colors line-clamp-1"
                >
                  {booking.listingName}
                </Link>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {booking.location}
                </p>
              </div>
              <Link
                href={listingHref}
                className="shrink-0 h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
              {booking.details.checkIn
                ? `${formatDate(booking.details.checkIn)}${booking.details.checkOut ? ` – ${formatDate(booking.details.checkOut)}` : ""}`
                : formatDate(booking.details.date)}
            </span>
            <span className="flex items-center gap-1">
              <CreditCard className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-semibold text-gray-900">
                K{booking.amount.toLocaleString()}
              </span>
            </span>
            <span className="font-mono text-[9px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
              {booking.bookingRef}
            </span>
          </div>

          {/* Status + Actions */}
          <div className="flex items-center justify-between gap-3 pt-1 border-t border-gray-50">
            <Badge
              variant="secondary"
              className={cn(
                "rounded-full text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5",
                booking.status === "confirmed" && isUpcoming
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : booking.status === "confirmed" && !isUpcoming
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-gray-50 text-gray-500 border-gray-200",
              )}
            >
              {booking.status === "confirmed" && isUpcoming && (
                <>
                  <Clock className="h-3 w-3 mr-1" /> Upcoming
                </>
              )}
              {booking.status === "confirmed" && !isUpcoming && (
                <>
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
                </>
              )}
              {booking.status === "cancelled" && (
                <>
                  <Ban className="h-3 w-3 mr-1" /> Cancelled
                </>
              )}
            </Badge>

            <div className="flex items-center gap-1">
              {booking.status === "confirmed" && isUpcoming && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 rounded-lg text-[10px] font-bold text-gray-400 hover:text-red-600 hover:bg-red-50 px-2.5"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      Cancel
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-bold tracking-tight">
                        Cancel this booking?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-sm">
                        This will cancel your booking at{" "}
                        <span className="font-semibold text-foreground">{booking.listingName}</span>{" "}
                        (ref: {booking.bookingRef}). Cancellation policies may apply and refunds are
                        subject to the host&apos;s terms.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl font-semibold text-xs">
                        Keep Booking
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold text-xs"
                        onClick={() => onCancel(booking.bookingRef)}
                      >
                        Yes, Cancel Booking
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              {booking.status === "confirmed" && !isUpcoming && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 rounded-lg text-[10px] font-bold text-amber-600 hover:text-amber-700 hover:bg-amber-50 px-2.5"
                  onClick={() => onReview(booking)}
                >
                  <Star className="h-3.5 w-3.5 mr-1 fill-amber-400 text-amber-400" />
                  Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//Section Component ───────────────────────────────────────────────────

function BookingSection({
  title,
  icon: Icon,
  iconColor,
  count,
  bookings,
  onCancel,
  onReview,
  emptyIcon: EmptyIcon,
  emptyTitle,
  emptyDescription,
  emptyAction,
}: {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  count: number;
  bookings: ConfirmedBooking[];
  onCancel: (ref: string) => void;
  onReview: (booking: ConfirmedBooking) => void;
  emptyIcon: React.ElementType;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div
          className={cn("h-7 w-7 rounded-lg flex items-center justify-center border", iconColor)}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
        </div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{title}</h3>
        <span className="text-[10px] text-gray-400">({count})</span>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-3">
            <EmptyIcon className="h-6 w-6 text-gray-300" />
          </div>
          <h4 className="text-sm font-bold text-gray-900">{emptyTitle}</h4>
          <p className="text-xs text-gray-500 mt-1 max-w-xs">{emptyDescription}</p>
          {emptyAction && <div className="mt-4">{emptyAction}</div>}
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.bookingRef}
              booking={booking}
              onCancel={onCancel}
              onReview={onReview}
            />
          ))}
        </div>
      )}
    </div>
  );
}

//Main Trips Page ────────────────────────────────────────────────────

export function TripsPage() {
  const { bookings, cancelBooking } = useBookingStore();
  const { user } = useAuth();
  const [reviewBooking, setReviewBooking] = useState<ConfirmedBooking | null>(null);

  const now = useMemo(() => new Date(), []);

  const upcoming = useMemo(
    () =>
      bookings.filter((b) => {
        if (b.status !== "confirmed") return false;
        const bookingDate = b.details.checkIn || b.details.date || "";
        return bookingDate ? new Date(bookingDate) >= now : true;
      }),
    [bookings, now],
  );

  const past = useMemo(
    () =>
      bookings.filter((b) => {
        if (b.status !== "confirmed") return false;
        const bookingDate = b.details.checkIn || b.details.date || "";
        return bookingDate ? new Date(bookingDate) < now : false;
      }),
    [bookings, now],
  );

  const cancelled = useMemo(() => bookings.filter((b) => b.status === "cancelled"), [bookings]);

  const handleCancel = useCallback(
    (bookingRef: string) => {
      cancelBooking(bookingRef);
      toast.success("Booking cancelled successfully.");
    },
    [cancelBooking],
  );

  const totalSpent = useMemo(
    () => bookings.filter((b) => b.status === "confirmed").reduce((sum, b) => sum + b.amount, 0),
    [bookings],
  );

  const uniqueDestinations = useMemo(
    () => new Set(bookings.map((b) => b.location)).size,
    [bookings],
  );

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* COVER HERO */}
      <div className="relative h-[200px] md:h-[240px] w-full overflow-hidden bg-gradient-to-br from-[#1A0B2E] via-[#2E154A] to-[#3A1A5A]">
        <img
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&q=60"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30 md:opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0B2E] via-[#1A0B2E]/60 to-transparent" />

        <div className="absolute bottom-6 left-4 md:left-8 md:bottom-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]/80 mb-2">
            Travel History
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm tracking-tight">
            My Trips
          </h1>
          <p className="text-sm text-white/60 mt-1">All your bookings in one place</p>
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 md:px-8 -mt-12 relative z-10">
        {/* STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          <StatCard
            icon={CalendarDays}
            label="Total Bookings"
            value={bookings.length}
            sub="All time"
            color="text-indigo-600 bg-indigo-50 border-indigo-200"
          />
          <StatCard
            icon={Clock}
            label="Upcoming"
            value={upcoming.length}
            sub={`${past.length} completed`}
            color="text-emerald-600 bg-emerald-50 border-emerald-200"
          />
          <StatCard
            icon={CreditCard}
            label="Total Spent"
            value={`K${totalSpent.toLocaleString()}`}
            sub="Across all trips"
            color="text-amber-600 bg-amber-50 border-amber-200"
          />
          <StatCard
            icon={MapIcon}
            label="Destinations"
            value={uniqueDestinations}
            sub="Unique places"
            color="text-sky-600 bg-sky-50 border-sky-200"
          />
        </div>

        {/* BOOKINGS */}
        <div className="pb-16 space-y-10">
          {bookings.length > 0 ? (
            <>
              {/* Upcoming */}
              <BookingSection
                title="Upcoming Trips"
                icon={Clock}
                iconColor="text-blue-600 bg-blue-50 border-blue-200"
                count={upcoming.length}
                bookings={upcoming}
                onCancel={handleCancel}
                onReview={setReviewBooking}
                emptyIcon={CalendarDays}
                emptyTitle="No upcoming trips"
                emptyDescription="You haven't booked any upcoming trips yet. Start exploring and plan your next adventure!"
                emptyAction={
                  <Button
                    size="sm"
                    className="rounded-xl bg-[#1A0B2E] hover:bg-[#2E154A] text-white font-bold text-xs tracking-wider px-5 shadow-lg shadow-[#1A0B2E]/20"
                    asChild
                  >
                    <Link href="/search">
                      Explore destinations <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Link>
                  </Button>
                }
              />

              {/* Past */}
              <BookingSection
                title="Past Trips"
                icon={CheckCircle2}
                iconColor="text-emerald-600 bg-emerald-50 border-emerald-200"
                count={past.length}
                bookings={past}
                onCancel={handleCancel}
                onReview={setReviewBooking}
                emptyIcon={CheckCircle2}
                emptyTitle="No past trips"
                emptyDescription="Completed trips will appear here after your adventures."
              />

              {/* Cancelled */}
              {cancelled.length > 0 && (
                <BookingSection
                  title="Cancelled"
                  icon={Ban}
                  iconColor="text-gray-500 bg-gray-100 border-gray-200"
                  count={cancelled.length}
                  bookings={cancelled}
                  onCancel={handleCancel}
                  onReview={setReviewBooking}
                  emptyIcon={XCircle}
                  emptyTitle="No cancelled bookings"
                  emptyDescription=""
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 flex items-center justify-center mb-6 border border-[#D4AF37]/10">
                <Compass className="h-10 w-10 text-[#D4AF37]/40" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-2">No trips yet</h2>
              <p className="text-sm text-gray-500 max-w-md mb-8 leading-relaxed">
                Your booking history will appear here once you book your first stay, experience, or
                transport. Start exploring Zambia!
              </p>
              <Button
                size="lg"
                className="rounded-xl bg-[#1A0B2E] hover:bg-[#2E154A] text-white font-bold text-xs tracking-wider px-8 shadow-lg shadow-[#1A0B2E]/20"
                asChild
              >
                <Link href="/search">
                  Start exploring <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Review Dialog */}
      {reviewBooking && (
        <ReviewDialog
          isOpen={!!reviewBooking}
          onClose={() => setReviewBooking(null)}
          listingId={reviewBooking.listingId}
          listingName={reviewBooking.listingName}
          listingType={reviewBooking.type}
          bookingRef={reviewBooking.bookingRef}
          guestName={user?.name ?? "Guest"}
        />
      )}
    </div>
  );
}
