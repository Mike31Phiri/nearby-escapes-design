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
  Gem,
  Eye,
  Download,
  RotateCcw,
  Mail,
  Phone,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AdminPageHeader } from "@/components/layout/AdminPageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { mockHostBookings } from "@/lib/mock-host-bookings";
import type { HostBooking } from "@/lib/mock-host-bookings";
import { useLoading, withLoading } from "@/lib/loading-context";
import { toastBookingAccepted, toastBookingDeclined, showSuccess, showWarning } from "@/lib/admin-toast";
import { toast } from "sonner";

// Type Helpers

const typeIcons: Record<string, React.ElementType> = {
  stay: Bed,
  experience: Ticket,
  transport: Bus,
  gem: Gem,
};

const typeLabels: Record<string, string> = {
  stay: "Stay",
  experience: "Experience",
  transport: "Transport",
  gem: "Hidden Gem",
};

const bookingStatusConfig: Record<
  string,
  { label: string; icon: React.ElementType; badgeClass: string }
> = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200/80",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200/80",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  },
  cancelled: {
    label: "Cancelled",
    icon: Ban,
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200/80",
  },
};

// Booking Inspection Modal
function BookingAuditDialog({
  booking,
  open,
  onOpenChange,
  onStatusChange,
}: {
  booking: HostBooking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (bookingId: string, newStatus: HostBooking["status"]) => void;
}) {
  const { setLoading, setLoadingMessage } = useLoading();
  if (!booking) return null;

  const TypeIcon = typeIcons[booking.listingType] || CalendarDays;
  const cfg = bookingStatusConfig[booking.status] || bookingStatusConfig.pending;
  const StatusIcon = cfg.icon;

  const commission = Math.round(booking.amount * 0.15);
  const netPayout = booking.amount - commission;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-ZM", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleIssueRefund = () => {
    withLoading(
      setLoading,
      setLoadingMessage,
      async () => {
        await new Promise((r) => setTimeout(r, 600));
        onStatusChange(booking.id, "cancelled");
        onOpenChange(false);
        showWarning(
          "Refund Processed",
          `Full refund of K${booking.amount.toLocaleString()} issued to ${booking.guestName}.`,
        );
      },
      "Processing gateway refund...",
    );
  };

  const handleConfirm = () => {
    withLoading(
      setLoading,
      setLoadingMessage,
      async () => {
        await new Promise((r) => setTimeout(r, 500));
        onStatusChange(booking.id, "confirmed");
        onOpenChange(false);
        showSuccess(
          "Booking Confirmed",
          `Reservation ${booking.bookingRef} has been confirmed. Host notified.`,
        );
      },
      "Confirming reservation...",
    );
  };

  const handleResendReceipt = () => {
    toast.success(`Booking receipt resent to ${booking.guestEmail}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border border-neutral-200/80 rounded-2xl shadow-xl p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full text-[11px] font-semibold tracking-wide px-2.5 py-0.5",
                    cfg.badgeClass,
                  )}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {cfg.label}
                </Badge>
                <span className="text-xs text-neutral-400 font-mono">Ref: {booking.bookingRef}</span>
              </div>
              <DialogTitle className="text-xl font-semibold text-neutral-900 mt-2">
                {booking.listingName}
              </DialogTitle>
              <DialogDescription className="text-sm text-neutral-500 flex items-center gap-1.5 mt-0.5">
                <TypeIcon className="h-3.5 w-3.5 text-neutral-400" />
                <span>{typeLabels[booking.listingType]}</span>
                <span>•</span>
                <span>
                  {booking.checkIn && booking.checkOut
                    ? `${formatDate(booking.checkIn)} — ${formatDate(booking.checkOut)}`
                    : formatDate(booking.date)}
                </span>
              </DialogDescription>
            </div>
            <div className="text-right">
              <span className="text-2xl font-semibold text-neutral-900">
                K{booking.amount.toLocaleString()}
              </span>
              <p className="text-xs text-neutral-500">Gross Price</p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Guest Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
              Guest Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-neutral-50/80 rounded-xl border border-neutral-200/70">
              <div>
                <span className="text-[11px] text-neutral-400 font-medium">Guest Name</span>
                <p className="text-sm font-semibold text-neutral-900 mt-0.5">{booking.guestName}</p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 font-medium">Email Address</span>
                <p className="text-sm font-medium text-neutral-800 flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3.5 w-3.5 text-neutral-400" />
                  {booking.guestEmail}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 font-medium">Phone Number</span>
                <p className="text-sm font-medium text-neutral-800 flex items-center gap-1.5 mt-0.5">
                  <Phone className="h-3.5 w-3.5 text-neutral-400" />
                  {booking.guestPhone}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
              <Receipt className="h-3.5 w-3.5 text-neutral-400" />
              Financial & Commission Audit
            </h4>
            <div className="rounded-xl border border-neutral-200/80 divide-y divide-neutral-100 bg-white">
              <div className="p-3.5 flex justify-between items-center text-sm">
                <span className="text-neutral-600">Gross Total (Guest Paid)</span>
                <span className="font-semibold text-neutral-900">K{booking.amount.toLocaleString()}</span>
              </div>
              <div className="p-3.5 flex justify-between items-center text-sm bg-purple/5">
                <div className="flex items-center gap-1.5">
                  <span className="text-purple font-medium">Platform Fee (15%)</span>
                  <Badge variant="outline" className="text-[10px] bg-purple/10 text-purple border-purple/20">
                    Platform Revenue
                  </Badge>
                </div>
                <span className="font-semibold text-purple">K{commission.toLocaleString()}</span>
              </div>
              <div className="p-3.5 flex justify-between items-center text-sm">
                <span className="text-neutral-600">Net Host Payout (85%)</span>
                <span className="font-semibold text-emerald-600">K{netPayout.toLocaleString()}</span>
              </div>
              <div className="p-3.5 flex justify-between items-center text-xs text-neutral-500 bg-neutral-50/50">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Escrow Status: Securely Held
                </span>
                <span>Payment Method: Mobile Money (Automated)</span>
              </div>
            </div>
          </div>

          {/* Admin Override Controls */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
              Administrative Overrides
            </h4>
            <div className="flex flex-wrap gap-2.5">
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-xl text-xs font-semibold border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                onClick={handleResendReceipt}
              >
                <Mail className="h-3.5 w-3.5 mr-1.5 text-neutral-500" />
                Resend Confirmation Receipt
              </Button>

              {booking.status === "pending" && (
                <Button
                  size="sm"
                  className="h-9 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/95 text-white"
                  onClick={handleConfirm}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                  Override & Confirm
                </Button>
              )}

              {booking.status !== "cancelled" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-xl text-xs font-semibold border-rose-200 text-rose-600 hover:bg-rose-50"
                  onClick={handleIssueRefund}
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Issue Refund & Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Booking Card

function BookingCard({
  booking,
  onInspect,
  onStatusChange,
}: {
  booking: HostBooking;
  onInspect: (booking: HostBooking) => void;
  onStatusChange: (id: string, newStatus: HostBooking["status"]) => void;
}) {
  const { setLoading, setLoadingMessage } = useLoading();
  const TypeIcon = typeIcons[booking.listingType] || CalendarDays;
  const cfg = bookingStatusConfig[booking.status] || bookingStatusConfig.pending;
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
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs transition-all duration-200 hover:border-neutral-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="h-11 w-11 shrink-0 rounded-xl bg-purple/10 border border-purple/15 flex items-center justify-center text-purple font-semibold text-base">
            {booking.guestName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h4 className="font-semibold text-neutral-900 text-base truncate">{booking.guestName}</h4>
              <Badge
                variant="outline"
                className={cn(
                  "rounded-full text-[11px] font-semibold tracking-wide px-2.5 py-0.5",
                  cfg.badgeClass,
                )}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {cfg.label}
              </Badge>
              <span className="text-xs text-neutral-400 font-mono">Ref: {booking.bookingRef}</span>
            </div>
            <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-1">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
              {booking.checkIn && booking.checkOut
                ? `${formatDate(booking.checkIn)} — ${formatDate(booking.checkOut)}`
                : formatDate(booking.date)}
              <span className="text-neutral-300">·</span>
              <span>{booking.guests} guest{booking.guests !== 1 ? "s" : ""}</span>
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-lg font-semibold text-neutral-900">K{booking.amount.toLocaleString()}</p>
          <p className="text-[11px] text-neutral-400 font-medium">Total Paid</p>
        </div>
      </div>

      {/* Listing Info */}
      <div className="mt-3.5 pt-3.5 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-neutral-600">
          <div className="h-5 w-5 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-600">
            <TypeIcon className="h-3 w-3" />
          </div>
          <span className="font-semibold text-neutral-900">{booking.listingName}</span>
          <span className="text-neutral-300">·</span>
          <span className="text-neutral-500">{typeLabels[booking.listingType]}</span>
          <span className="text-neutral-300">·</span>
          <span className="text-neutral-500">{booking.guestEmail}</span>
        </div>

        <div className="flex items-center gap-2">
          {booking.status === "pending" && (
            <>
              <Button
                size="sm"
                className="h-8 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() =>
                  withLoading(
                    setLoading,
                    setLoadingMessage,
                    async () => {
                      await new Promise((r) => setTimeout(r, 600));
                      onStatusChange(booking.id, "confirmed");
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
                className="h-8 px-3 rounded-lg text-xs font-semibold border-rose-200 text-rose-600 hover:bg-rose-50"
                onClick={() =>
                  withLoading(
                    setLoading,
                    setLoadingMessage,
                    async () => {
                      await new Promise((r) => setTimeout(r, 600));
                      onStatusChange(booking.id, "cancelled");
                      toastBookingDeclined(booking.guestName);
                    },
                    "Declining booking...",
                  )
                }
              >
                <XCircle className="h-3.5 w-3.5 mr-1" /> Decline
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 rounded-lg text-xs font-semibold border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            onClick={() => onInspect(booking)}
          >
            <Eye className="h-3.5 w-3.5 mr-1 text-neutral-400" /> Inspect
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main Component

export function AdminBookings() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "stay" | "experience" | "transport">("all");
  const [bookings, setBookings] = useState<HostBooking[]>(mockHostBookings);
  const [selectedBooking, setSelectedBooking] = useState<HostBooking | null>(null);

  const bookingStats = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
      totalRevenue: bookings.reduce((sum, b) => sum + b.amount, 0),
      platformCommission: Math.round(bookings.reduce((sum, b) => sum + b.amount, 0) * 0.15),
    }),
    [bookings],
  );

  const handleStatusChange = (bookingId: string, newStatus: HostBooking["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)),
    );
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        !search ||
        b.guestName.toLowerCase().includes(search.toLowerCase()) ||
        b.listingName.toLowerCase().includes(search.toLowerCase()) ||
        b.bookingRef.toLowerCase().includes(search.toLowerCase()) ||
        b.guestEmail.toLowerCase().includes(search.toLowerCase()) ||
        b.guestPhone.includes(search);
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const matchesType = typeFilter === "all" || b.listingType === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [bookings, search, statusFilter, typeFilter]);

  const handleExportCSV = () => {
    const headers = [
      "Booking Ref",
      "Guest Name",
      "Guest Email",
      "Guest Phone",
      "Listing Name",
      "Listing Type",
      "Check In / Date",
      "Check Out",
      "Guests",
      "Total Amount (ZMW)",
      "Status",
    ];

    const rows = filteredBookings.map((b) => [
      b.bookingRef,
      `"${b.guestName}"`,
      b.guestEmail,
      b.guestPhone,
      `"${b.listingName}"`,
      b.listingType,
      b.checkIn || b.date || "",
      b.checkOut || "",
      b.guests,
      b.amount,
      b.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nearbyescapes-bookings-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Bookings export downloaded successfully");
  };

  return (
    <div className="flex-1 min-h-screen bg-neutral-50/50 pb-16">
      <AdminPageHeader
        eyebrow="Transactions & Stays"
        title="Platform Bookings"
        description={`${bookingStats.total} total reservations · K${bookingStats.totalRevenue.toLocaleString()} gross transacted`}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="h-9 px-3.5 rounded-xl text-xs font-semibold border-neutral-200/80 bg-white hover:bg-neutral-50 shadow-2xs"
            >
              <Download className="h-3.5 w-3.5 mr-1.5 text-neutral-500" />
              Export CSV
            </Button>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6 mt-6 space-y-6">
        {/* KPI Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
            <p className="text-2xl font-semibold text-neutral-900">{bookingStats.total}</p>
            <p className="text-xs text-neutral-500 mt-0.5">Total Bookings</p>
          </div>
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
            <p className="text-2xl font-semibold text-amber-600">{bookingStats.pending}</p>
            <p className="text-xs text-neutral-500 mt-0.5">Pending Review</p>
          </div>
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
            <p className="text-2xl font-semibold text-blue-600">{bookingStats.confirmed}</p>
            <p className="text-xs text-neutral-500 mt-0.5">Confirmed</p>
          </div>
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
            <p className="text-2xl font-semibold text-emerald-600">{bookingStats.completed}</p>
            <p className="text-xs text-neutral-500 mt-0.5">Completed</p>
          </div>
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
            <p className="text-2xl font-semibold text-rose-600">{bookingStats.cancelled}</p>
            <p className="text-xs text-neutral-500 mt-0.5">Cancelled</p>
          </div>
          <div className="rounded-2xl border border-purple/20 bg-purple/5 p-4 shadow-2xs">
            <p className="text-2xl font-semibold text-purple">
              K{bookingStats.platformCommission.toLocaleString()}
            </p>
            <p className="text-xs text-purple/80 mt-0.5">Platform Fee (15%)</p>
          </div>
        </div>

        {/* Filter bar and tabs */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
            {/* Quick Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: "all", label: "All", count: bookingStats.total },
                { id: "pending", label: "Pending", count: bookingStats.pending },
                { id: "confirmed", label: "Confirmed", count: bookingStats.confirmed },
                { id: "completed", label: "Completed", count: bookingStats.completed },
                { id: "cancelled", label: "Cancelled", count: bookingStats.cancelled },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5",
                    statusFilter === tab.id
                      ? "bg-neutral-900 text-white font-semibold shadow-xs"
                      : "text-neutral-600 hover:bg-neutral-100/80",
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[10px]",
                      statusFilter === tab.id
                        ? "bg-neutral-700 text-white"
                        : "bg-neutral-100 text-neutral-500",
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <span className="text-xs text-neutral-400 self-end sm:self-auto">
              Showing {filteredBookings.length} of {bookingStats.total}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search by guest, listing, or reference..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-xl border-neutral-200/80 bg-neutral-50/50 text-sm focus:bg-white transition-all"
              />
            </div>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
              <SelectTrigger className="w-[150px] h-10 rounded-xl border-neutral-200/80 bg-neutral-50/50 text-xs font-medium">
                <SelectValue placeholder="Listing Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="stay">Stays</SelectItem>
                <SelectItem value="experience">Experiences</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bookings Stream */}
        <div className="space-y-3">
          {filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-neutral-200/80 p-8 shadow-2xs">
              <div className="h-14 w-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-3">
                <CalendarDays className="h-6 w-6 text-neutral-400" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900">No bookings found</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                Try adjusting your search terms or filter selection.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-5 rounded-xl text-xs font-semibold"
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
            filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onInspect={(b) => setSelectedBooking(b)}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
      </div>

      <BookingAuditDialog
        booking={selectedBooking}
        open={!!selectedBooking}
        onOpenChange={(open) => {
          if (!open) setSelectedBooking(null);
        }}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
