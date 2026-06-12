"use client";

import { useState, useMemo } from "react";
import {
  CalendarDays,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
  DollarSign,
  Bed,
  Ticket,
  Bus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { mockHostBookings } from "@/lib/mock-host-bookings";
import type { HostBooking } from "@/lib/mock-host-bookings";
import { useLoading, withLoading } from "@/lib/loading-context";
import { toastBookingAccepted, toastBookingDeclined } from "@/lib/admin-toast";

// ─── Type Helpers ───────────────────────────────────────────────────────

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

const bookingStatusConfig: Record<
  string,
  { label: string; icon: React.ElementType; badgeClass: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    icon: Ban,
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

// ─── Booking Card ───────────────────────────────────────────────────────

function BookingCard({ booking }: { booking: HostBooking }) {
  const { setLoading, setLoadingMessage } = useLoading();
  const TypeIcon = typeIcons[booking.listingType];
  const cfg = bookingStatusConfig[booking.status];
  const StatusIcon = cfg.icon;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-ZM", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {booking.guestName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-foreground truncate">{booking.guestName}</h4>
              <Badge
                variant="outline"
                className={cn(
                  "rounded-full text-[8px] font-bold uppercase tracking-wider px-2 py-0.5",
                  cfg.badgeClass,
                )}
              >
                <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
                {cfg.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <CalendarDays className="h-3 w-3 shrink-0" />
              {booking.checkIn && booking.checkOut
                ? `${formatDate(booking.checkIn)} — ${formatDate(booking.checkOut)}`
                : formatDate(booking.date)}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-foreground">K{booking.amount.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground font-medium">
            {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Listing Info */}
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <TypeIcon className="h-3 w-3" />
        <span className="font-semibold">{booking.listingName}</span>
        <span>·</span>
        <span>{typeLabels[booking.listingType]}</span>
        <span>·</span>
        <span>Ref: {booking.bookingRef}</span>
      </div>

      {/* Contact */}
      <div className="mt-3 flex items-center gap-3 text-xs">
        <span className="text-muted-foreground">{booking.guestEmail}</span>
        <span className="text-muted-foreground/50">·</span>
        <span className="text-muted-foreground">{booking.guestPhone}</span>
      </div>

      {/* Actions for pending bookings */}
      {booking.status === "pending" && (
        <div className="mt-3 pt-3 border-t border-border/30 flex items-center gap-2">
          <Button
            size="sm"
            className="h-8 rounded-lg text-xs font-semibold"
            onClick={() =>
              withLoading(
                setLoading,
                setLoadingMessage,
                async () => {
                  await new Promise((r) => setTimeout(r, 600));
                  toastBookingAccepted(booking.guestName);
                },
                "Accepting booking...",
              )
            }
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Accept
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg text-xs font-semibold border-rose-200 text-rose-600"
            onClick={() =>
              withLoading(
                setLoading,
                setLoadingMessage,
                async () => {
                  await new Promise((r) => setTimeout(r, 600));
                  toastBookingDeclined(booking.guestName);
                },
                "Declining booking...",
              )
            }
          >
            <XCircle className="h-3.5 w-3.5 mr-1" /> Decline
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────

export function AdminBookings() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "stay" | "experience" | "transport">("all");

  const allBookings = mockHostBookings;

  const bookingStats = useMemo(
    () => ({
      total: allBookings.length,
      pending: allBookings.filter((b) => b.status === "pending").length,
      confirmed: allBookings.filter((b) => b.status === "confirmed").length,
      completed: allBookings.filter((b) => b.status === "completed").length,
      cancelled: allBookings.filter((b) => b.status === "cancelled").length,
      totalRevenue: allBookings.reduce((sum, b) => sum + b.amount, 0),
    }),
    [allBookings],
  );

  const filteredBookings = useMemo(() => {
    return allBookings.filter((b) => {
      const matchesSearch =
        !search ||
        b.guestName.toLowerCase().includes(search.toLowerCase()) ||
        b.listingName.toLowerCase().includes(search.toLowerCase()) ||
        b.bookingRef.toLowerCase().includes(search.toLowerCase()) ||
        b.guestEmail.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const matchesType = typeFilter === "all" || b.listingType === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [allBookings, search, statusFilter, typeFilter]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <div className="flex-1">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pb-8">
          <div className="mx-auto max-w-6xl px-4 md:px-6 pt-6 md:pt-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  Platform Bookings
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {bookingStats.total} bookings — K{bookingStats.totalRevenue.toLocaleString()}{" "}
                  total value
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{bookingStats.pending} pending</span>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-emerald-600 font-semibold">
                  {bookingStats.completed} completed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 -mt-6 relative z-10">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/40 bg-card p-3 shadow-sm">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by guest, listing, or reference..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-xl border-border/60 text-sm"
              />
            </div>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
              <SelectTrigger className="w-[140px] h-10 rounded-xl border-border/60">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="stay">Stays</SelectItem>
                <SelectItem value="experience">Experiences</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
            >
              <SelectTrigger className="w-[150px] h-10 rounded-xl border-border/60">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-foreground">{bookingStats.total}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Total
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-amber-600">{bookingStats.pending}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Pending
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-blue-600">{bookingStats.confirmed}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Confirmed
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-emerald-600">{bookingStats.completed}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Completed
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-rose-600">{bookingStats.cancelled}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Cancelled
              </p>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 mt-6 pb-16 space-y-3">
          {filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <CalendarDays className="h-7 w-7 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No bookings found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Try adjusting your search or filter criteria.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-6 rounded-full text-xs font-semibold"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            filteredBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
          )}
        </div>
      </div>
    </div>
  );
}
