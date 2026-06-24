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
  Search,
  ChevronLeft,
  ChevronRight,
  Ban,
  Star,
  Gem,
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
import { ReviewDialog } from "@/components/reviews/ReviewDialog";
import { useAuth } from "@/lib/auth";

// ─── Stats Card ──────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card p-5 shadow-sm card-shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-5.5 w-5.5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        {sub && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Booking Type Icon ───────────────────────────────────────────────────

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

// ─── Booking Card ────────────────────────────────────────────────────────

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
    <div className="group flex flex-col sm:flex-row sm:items-start gap-4 rounded-xl border border-border/50 bg-card p-4 shadow-sm card-shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      {/* Image */}
      <div className="relative h-28 w-full sm:h-24 sm:w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
        <img
          src={booking.image}
          alt={booking.listingName}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
          <TypeIcon className="h-3 w-3" />
          <span>{typeLabels[booking.type]}</span>
        </div>
        {/* Status badge on image */}
        {booking.status === "cancelled" && (
          <div className="absolute top-1.5 right-1.5 rounded-full bg-rose-500/90 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
            Cancelled
          </div>
        )}
        {booking.status === "confirmed" && !isUpcoming && (
          <div className="absolute top-1.5 right-1.5 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
            Completed
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-2.5">
        <div>
          <Link
            href={listingHref}
            className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
          >
            {booking.listingName}
          </Link>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 shrink-0" />
            {booking.location}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {booking.details.checkIn
              ? `${formatDate(booking.details.checkIn)}${booking.details.checkOut ? ` – ${formatDate(booking.details.checkOut)}` : ""}`
              : formatDate(booking.details.date)}
          </span>
          <span className="flex items-center gap-1">
            <CreditCard className="h-3 w-3" />
            <span className="font-semibold text-foreground">
              K{booking.amount.toLocaleString()}
            </span>
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/50">
            {booking.bookingRef}
          </span>
        </div>

        {/* Status + Actions */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <Badge
            variant="secondary"
            className={cn(
              "rounded-full text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5",
              booking.status === "confirmed" && isUpcoming
                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                : booking.status === "confirmed" && !isUpcoming
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
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

          <div className="flex items-center gap-1.5">
            {booking.status === "confirmed" && isUpcoming && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 font-semibold px-2.5"
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
                className="h-8 rounded-lg text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950 font-semibold px-2.5"
                onClick={() => onReview(booking)}
              >
                <Star className="h-3.5 w-3.5 mr-1 fill-amber-400 text-amber-400" />
                Review
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" asChild>
              <Link href={listingHref}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section Component ───────────────────────────────────────────────────

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
        <Icon className={cn("h-4 w-4", iconColor)} />
        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">({count})</span>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border/50 bg-card/30 card-shadow">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <EmptyIcon className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <h4 className="text-sm font-bold text-foreground">{emptyTitle}</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">{emptyDescription}</p>
          {emptyAction && <div className="mt-4">{emptyAction}</div>}
        </div>
      ) : (
        <div className="relative flex items-center">
          <button
            onClick={() => {
              const el = document.getElementById(
                `booking-scroll-${title.replace(/\s+/g, "-").toLowerCase()}`,
              );
              el?.scrollBy({ left: -350, behavior: "smooth" });
            }}
            className="hidden md:flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-white border border-border/60 shadow-sm hover:bg-muted transition-all -ml-2 mr-1 z-10"
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>

          <div
            id={`booking-scroll-${title.replace(/\s+/g, "-").toLowerCase()}`}
            className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth flex-1 py-1"
          >
            {bookings.map((booking) => (
              <div
                key={booking.bookingRef}
                className="min-w-[340px] md:min-w-[450px] lg:min-w-[520px] shrink-0"
              >
                <BookingCard booking={booking} onCancel={onCancel} onReview={onReview} />
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              const el = document.getElementById(
                `booking-scroll-${title.replace(/\s+/g, "-").toLowerCase()}`,
              );
              el?.scrollBy({ left: 350, behavior: "smooth" });
            }}
            className="hidden md:flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-white border border-border/60 shadow-sm hover:bg-muted transition-all ml-1 -mr-2 z-10"
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Trips Page ────────────────────────────────────────────────────

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

  return (
    <div className="min-h-screen flex flex-col bg-muted font-sans">
      <main className="flex-1">
        {/* Page Header */}
        <div className="relative bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pb-10">
          <div className="mx-auto max-w-4xl px-4 md:px-6 pt-8 md:pt-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                      My Trips
                    </h1>
                    <p className="text-sm text-muted-foreground">All your bookings in one place</p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-border/60 font-black uppercase tracking-widest text-[10px] w-fit"
                asChild
              >
                <Link href="/search">
                  <Search className="h-3.5 w-3.5 mr-1.5" />
                  Browse More
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Row — Horizontally scrollable with arrows */}
        <div className="mx-auto max-w-4xl px-4 md:px-6 -mt-6 relative z-10">
          <div className="relative flex items-center">
            <button
              onClick={() => {
                const el = document.getElementById("trips-stats-scroll");
                el?.scrollBy({ left: -300, behavior: "smooth" });
              }}
              className="hidden md:flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-white border border-border/60 shadow-sm hover:bg-muted transition-all mr-2 z-10"
              aria-label="Scroll stats left"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>

            <div
              id="trips-stats-scroll"
              className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth flex-1 py-1"
            >
              <div className="min-w-[220px] md:min-w-[230px]">
                <StatCard
                  icon={CalendarDays}
                  label="Total Bookings"
                  value={bookings.length}
                  sub="All time"
                />
              </div>
              <div className="min-w-[220px] md:min-w-[230px]">
                <StatCard
                  icon={Clock}
                  label="Upcoming"
                  value={upcoming.length}
                  sub={`${past.length} completed`}
                />
              </div>
              <div className="min-w-[220px] md:min-w-[230px]">
                <StatCard
                  icon={CreditCard}
                  label="Total Spent"
                  value={`K${totalSpent.toLocaleString()}`}
                  sub="Across all trips"
                />
              </div>
              <div className="min-w-[220px] md:min-w-[230px]">
                <StatCard
                  icon={Compass}
                  label="Destinations"
                  value={new Set(bookings.map((b) => b.location)).size}
                  sub="Unique places"
                />
              </div>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById("trips-stats-scroll");
                el?.scrollBy({ left: 300, behavior: "smooth" });
              }}
              className="hidden md:flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-white border border-border/60 shadow-sm hover:bg-muted transition-all ml-2 z-10"
              aria-label="Scroll stats right"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          </div>
        </div>

        {/* Bookings Content */}
        <div className="mx-auto max-w-4xl px-4 md:px-6 mt-10 pb-16 space-y-10">
          {bookings.length > 0 ? (
            <>
              {/* Upcoming */}
              <BookingSection
                title="Upcoming Trips"
                icon={Clock}
                iconColor="text-primary"
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
                    className="rounded-full font-black uppercase tracking-widest text-xs"
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
                iconColor="text-emerald-500"
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
                  iconColor="text-muted-foreground"
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
              <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                <Compass className="h-10 w-10 text-primary/40" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">
                No trips yet
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mb-8">
                Your booking history will appear here once you book your first stay, experience, or
                transport. Start exploring Zambia!
              </p>
              <Button
                size="lg"
                className="rounded-full font-black uppercase tracking-widest text-xs shadow-lg"
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
