"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  DollarSign,
  Users,
  Mail,
  Phone,
  MessageSquare,
  ChevronLeft,
  Bed,
  Ticket,
  Bus,
  Search,
  Loader2,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { mockHostBookings, statsFromBookings } from "@/lib/mock-host-bookings";
import type { HostBooking } from "@/lib/mock-host-bookings";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────

type StatusFilter = "all" | "pending" | "confirmed" | "completed" | "cancelled";

// ─── Status Config ───────────────────────────────────────────────────────

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    dotClass: "bg-amber-400",
    badgeClass:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    dotClass: "bg-blue-500",
    badgeClass:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    dotClass: "bg-emerald-500",
    badgeClass:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  },
  cancelled: {
    label: "Cancelled",
    icon: Ban,
    dotClass: "bg-rose-400",
    badgeClass:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
  },
} as const;

const typeIcons: Record<string, React.ElementType> = {
  stay: Bed,
  experience: Ticket,
  transport: Bus,
};

const typeLabels: Record<string, string> = {
  stay: "Stay",
  experience: "Experience",
  transport: "Transport",
};

// ─── Stat Card ───────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: { value: string; positive: boolean };
  accent?: string;
}) {
  return (
    <div className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20">
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
          accent ? `${accent}/10 text-${accent}` : "bg-primary/10 text-primary",
        )}
        style={accent ? { backgroundColor: `${accent}1a`, color: accent } : undefined}
      >
        <Icon className="h-5.5 w-5.5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        {trend && (
          <p
            className={cn(
              "text-[10px] font-bold mt-0.5 flex items-center gap-0.5",
              trend.positive ? "text-emerald-600" : "text-destructive",
            )}
          >
            {trend.value}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Booking Card ────────────────────────────────────────────────────────

function BookingCard({
  booking,
  onAccept,
  onDecline,
  processing,
}: {
  booking: HostBooking;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  processing: string | null;
}) {
  const cfg = statusConfig[booking.status];
  const StatusIcon = cfg.icon;
  const TypeIcon = typeIcons[booking.listingType];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-ZM", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(dateStr);
  };

  return (
    <div className="group rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md overflow-hidden">
      {/* Top Section: Image + Guest Info */}
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative h-36 sm:h-auto sm:w-48 shrink-0 overflow-hidden bg-muted">
          <img
            src={booking.listingImage}
            alt={booking.listingName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent sm:bg-gradient-to-r sm:from-black/40 sm:to-transparent" />
          <div className="absolute bottom-2 left-2 sm:top-2 sm:bottom-auto flex items-center gap-1.5">
            <div className="rounded-md bg-black/60 px-2 py-1 text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
              <TypeIcon className="h-3 w-3" />
              <span>{typeLabels[booking.listingType]}</span>
            </div>
            <div className="rounded-full bg-black/60 px-2 py-1 text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
              <StatusIcon className="h-3 w-3" />
              <span>{cfg.label}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <Link
                href={`/listings/${
                  booking.listingType === "stay"
                    ? "stays"
                    : booking.listingType === "experience"
                      ? "experiences"
                      : "transport"
                }/${booking.listingId}`}
                className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
              >
                {booking.listingName}
              </Link>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0" />
                {booking.listingType === "stay"
                  ? "Lodge"
                  : booking.listingType === "experience"
                    ? "Activity"
                    : "Route"}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "rounded-full text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 shrink-0 border",
                cfg.badgeClass,
              )}
            >
              {cfg.label}
            </Badge>
          </div>

          {/* Guest Info */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
              {booking.guestName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{booking.guestName}</p>
              <p className="text-[10px] text-muted-foreground">
                Requested {formatTimeAgo(booking.createdAt)}
              </p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {booking.checkIn
                ? `${formatDate(booking.checkIn)}${booking.checkOut ? ` — ${formatDate(booking.checkOut)}` : ""}`
                : formatDate(booking.date)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {booking.guests} guest{booking.guests > 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1 font-semibold text-foreground">
              <DollarSign className="h-3.5 w-3.5" />K{booking.amount.toLocaleString()}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/50">
              {booking.bookingRef}
            </span>
          </div>

          {/* Guest Message */}
          {booking.message && (
            <div className="flex items-start gap-2 rounded-lg bg-muted/40 p-3 border border-border/30">
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {booking.message}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="flex items-center justify-between gap-3 border-t border-border/40 bg-muted/20 px-4 sm:px-5 py-3">
        {/* Contact Buttons */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-lg text-xs text-muted-foreground hover:text-primary font-semibold"
            title={`Email ${booking.guestName}`}
          >
            <Mail className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">Email</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-lg text-xs text-muted-foreground hover:text-primary font-semibold"
            title={`Call ${booking.guestName}`}
          >
            <Phone className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">Call</span>
          </Button>
        </div>

        {/* Accept/Decline Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/listings/${
              booking.listingType === "stay"
                ? "stays"
                : booking.listingType === "experience"
                  ? "experiences"
                  : "transport"
            }/${booking.listingId}`}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-lg text-xs text-muted-foreground font-semibold"
            >
              View Listing
            </Button>
          </Link>

          {booking.status === "pending" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDecline(booking.id)}
                disabled={processing === booking.id}
                className="h-8 rounded-lg text-xs border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold uppercase tracking-wider"
              >
                {processing === booking.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                    Decline
                  </>
                )}
              </Button>
              <Button
                size="sm"
                onClick={() => onAccept(booking.id)}
                disabled={processing === booking.id}
                className="h-8 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider shadow-sm"
              >
                {processing === booking.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Accept
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────

export function HostBookingsPage() {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);
  const [bookings, setBookings] = useState<HostBooking[]>(mockHostBookings);

  // Derived stats
  const stats = useMemo(() => statsFromBookings(bookings), [bookings]);

  // Filtered & searched bookings
  const filteredBookings = useMemo(() => {
    let result =
      activeFilter === "all" ? bookings : bookings.filter((b) => b.status === activeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.guestName.toLowerCase().includes(q) ||
          b.listingName.toLowerCase().includes(q) ||
          b.bookingRef.toLowerCase().includes(q) ||
          b.guestEmail.toLowerCase().includes(q),
      );
    }
    return result;
  }, [bookings, activeFilter, searchQuery]);

  // Sort: pending first, then by newest
  const sortedBookings = useMemo(
    () =>
      [...filteredBookings].sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }),
    [filteredBookings],
  );

  // ─── Accept / Decline Handlers ────────────────────────────────────────

  const handleAccept = useCallback(
    (id: string) => {
      // Find guest name before async operation
      const guest = bookings.find((b) => b.id === id);
      const guestName = guest?.guestName ?? "Guest";
      setProcessing(id);
      // Simulate API call
      setTimeout(() => {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === id
              ? { ...b, status: "confirmed" as const, updatedAt: new Date().toISOString() }
              : b,
          ),
        );
        setProcessing(null);
        toast.success(
          `Booking confirmed for ${guestName}! A confirmation notification has been sent.`,
        );
      }, 1200);
    },
    [bookings],
  );

  const handleDecline = useCallback(
    (id: string) => {
      // Find guest name before async operation
      const guest = bookings.find((b) => b.id === id);
      const guestName = guest?.guestName ?? "Guest";
      setProcessing(id);
      // Simulate API call
      setTimeout(() => {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === id
              ? { ...b, status: "cancelled" as const, updatedAt: new Date().toISOString() }
              : b,
          ),
        );
        setProcessing(null);
        toast.success(`Booking request from ${guestName} has been declined. They'll be notified.`);
      }, 1200);
    },
    [bookings],
  );

  const filters: { id: StatusFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: stats.total },
    { id: "pending", label: "Pending", count: stats.pending },
    { id: "confirmed", label: "Confirmed", count: stats.confirmed },
    { id: "completed", label: "Completed", count: stats.completed },
    { id: "cancelled", label: "Cancelled", count: stats.cancelled },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans">
      <main className="flex-1">
        {/* ─── Page Header ──────────────────────────────────────────── */}
        <div className="relative bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pb-10">
          <div className="mx-auto max-w-6xl px-4 md:px-6 pt-8 md:pt-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Link
                  href="/host"
                  className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mb-2"
                >
                  <ChevronLeft className="h-3 w-3" />
                  Back to Host Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                      Booking Requests
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Manage incoming requests and guest communications
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Stats Row ────────────────────────────────────────────── */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 -mt-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatCard icon={CalendarDays} label="Total Requests" value={String(stats.total)} />
            <StatCard
              icon={Clock}
              label="Pending"
              value={String(stats.pending)}
              accent="#f59e0b"
              trend={
                stats.pending > 0
                  ? { value: `${stats.pending} awaiting response`, positive: true }
                  : undefined
              }
            />
            <StatCard
              icon={DollarSign}
              label="Confirmed Revenue"
              value={`K${stats.revenue.toLocaleString()}`}
              accent="#10b981"
            />
            <StatCard
              icon={AlertTriangle}
              label="Pending Value"
              value={`K${stats.pendingRevenue.toLocaleString()}`}
              accent="#f59e0b"
              trend={
                stats.pending > 0 ? { value: "Awaiting your decision", positive: false } : undefined
              }
            />
          </div>
        </div>

        {/* ─── Content ──────────────────────────────────────────────── */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 mt-10 pb-16">
          {/* Filters + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            {/* Filter Tabs */}
            <div className="flex border-b border-border/50 gap-0 overflow-x-auto scrollbar-none">
              {filters.map(({ id, label, count }) => {
                const isActive = activeFilter === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveFilter(id)}
                    className={cn(
                      "flex items-center gap-2 pb-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all duration-200 whitespace-nowrap",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30",
                    )}
                  >
                    {label}
                    <span
                      className={cn(
                        "ml-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold",
                        isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative shrink-0 w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input
                placeholder="Search by guest, listing, or ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-9 rounded-xl border-border/60 text-sm"
              />
            </div>
          </div>

          {/* Booking Cards */}
          {sortedBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                {activeFilter === "pending" ? (
                  <Clock className="h-10 w-10 text-muted-foreground/40" />
                ) : activeFilter === "confirmed" ? (
                  <CheckCircle2 className="h-10 w-10 text-muted-foreground/40" />
                ) : activeFilter === "cancelled" ? (
                  <Ban className="h-10 w-10 text-muted-foreground/40" />
                ) : (
                  <CalendarDays className="h-10 w-10 text-muted-foreground/40" />
                )}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {searchQuery
                  ? "No results found"
                  : activeFilter === "pending"
                    ? "No pending requests"
                    : activeFilter === "confirmed"
                      ? "No confirmed bookings"
                      : activeFilter === "completed"
                        ? "No completed bookings"
                        : activeFilter === "cancelled"
                          ? "No cancelled bookings"
                          : "No bookings yet"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-8">
                {searchQuery
                  ? "Try adjusting your search terms or clearing the filter."
                  : activeFilter !== "all"
                    ? `There are no bookings with the "${activeFilter}" status at the moment.`
                    : "Guest booking requests for your listings will appear here."}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="rounded-full font-semibold text-xs border-border/60"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Pending notice */}
              {activeFilter === "all" && stats.pending > 0 && (
                <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/30 px-5 py-3">
                  <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                  <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                    You have{" "}
                    <span className="font-bold">
                      {stats.pending} pending booking request{stats.pending > 1 ? "s" : ""}
                    </span>{" "}
                    awaiting your response.
                    <button
                      onClick={() => setActiveFilter("pending")}
                      className="ml-1 font-bold underline underline-offset-2 hover:text-amber-900 transition-colors"
                    >
                      Review now
                    </button>
                  </p>
                </div>
              )}

              {sortedBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  processing={processing}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
