"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Eye, CalendarDays, FileText } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { mockHostBookings } from "@/lib/mock-host-bookings";
import type { HostBooking } from "@/lib/mock-host-bookings";
import { HostPageHeader } from "@/components/layout/HostPageHeader";
import { BookingDetailsDialog, STATUS_BADGE, formatDay, initials } from "./BookingDetailsDialog";

const bookingDates = (booking: HostBooking) =>
  booking.checkIn
    ? `${formatDay(booking.checkIn)} – ${formatDay(booking.checkOut!)}`
    : booking.date
      ? formatDay(booking.date)
      : "";


function BookingRow({
  booking,
  onOpen,
}: {
  booking: HostBooking;
  onOpen: (booking: HostBooking) => void;
}) {
  const badge = STATUS_BADGE[booking.status];

  return (
    <div className="flex items-center gap-3 p-4 transition-colors hover:bg-neutral-50/70">
      <button
        onClick={() => onOpen(booking)}
        aria-label={`View details for ${booking.guestName}`}
        className="flex items-center gap-3.5 flex-1 min-w-0 text-left outline-none"
      >
        <div className="h-10 w-10 shrink-0 rounded-full bg-purple/10 text-purple border border-purple/20 flex items-center justify-center text-xs font-bold">
          {initials(booking.guestName)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-neutral-900 truncate">
            {booking.guestName}{" "}
            <span className="text-neutral-400 font-normal">
              · {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
            </span>
          </div>
          <div className="text-xs text-neutral-600 truncate mt-0.5">{booking.listingName}</div>
          <div className="text-xs text-neutral-400 truncate mt-0.5 font-medium">
            {bookingDates(booking)} · K{booking.amount.toLocaleString()}
          </div>
        </div>
      </button>

      <span
        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 border"
        style={{
          background: badge.bg,
          color: badge.fg,
          borderColor: `${badge.fg}30`,
        }}
      >
        {badge.label}
      </span>

      <button
        onClick={() => onOpen(booking)}
        aria-label={`View details for booking ${booking.bookingRef}`}
        className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-purple hover:border-purple/40 hover:bg-purple/5 transition-colors outline-none"
      >
        <Eye className="h-3.5 w-3.5" />
        View
      </button>
    </div>
  );
}

function GroupSection({
  title,
  count,
  tone,
  children,
}: {
  title: string;
  count: number;
  tone: "purple" | "emerald";
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "w-6 h-6 rounded-lg flex items-center justify-center",
            tone === "purple" ? "bg-purple/10" : "bg-emerald-50",
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              tone === "purple" ? "bg-purple" : "bg-emerald-600",
            )}
          />
        </div>
        <span className="text-sm font-bold text-neutral-900">
          {title} ({count})
        </span>
      </div>
      <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-2xs overflow-hidden divide-y divide-neutral-100">
        {children}
      </div>
    </div>
  );
}


export function HostBookingsPage() {
  const [processing, setProcessing] = useState<string | null>(null);
  const [bookings, setBookings] = useState<HostBooking[]>(mockHostBookings);
  const [selected, setSelected] = useState<HostBooking | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const pending = bookings.filter((b) => b.status === "pending");
  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const completed = bookings.filter((b) => b.status === "completed");

  const openDetails = useCallback((booking: HostBooking) => {
    setSelected(booking);
    setDetailsOpen(true);
  }, []);

  const handleAccept = useCallback(
    (id: string) => {
      const guest = bookings.find((b) => b.id === id);
      setProcessing(id);
      setTimeout(() => {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "confirmed" as const } : b)),
        );
        setProcessing(null);
        toast.success(`Booking confirmed for ${guest?.guestName ?? "Guest"}!`);
      }, 800);
    },
    [bookings],
  );

  const handleDecline = useCallback(
    (id: string) => {
      const guest = bookings.find((b) => b.id === id);
      setProcessing(id);
      setTimeout(() => {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b)),
        );
        setProcessing(null);
        toast.success(`Booking from ${guest?.guestName ?? "Guest"} declined.`);
      }, 800);
    },
    [bookings],
  );

  return (
    <div className="min-h-screen bg-background pb-16 font-sans">
      <HostPageHeader
        title="Bookings"
        description="View, approve, and manage all your upcoming and past guest stays."
        actions={
          <Link
            href="/host/bookings/manifest"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-neutral-200/80 bg-white text-xs font-bold text-neutral-700 hover:border-purple/40 hover:text-purple shadow-2xs transition-all"
          >
            <FileText className="h-4 w-4" />
            Daily Manifest
          </Link>
        }
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8 space-y-8">
        {/* Pending approval */}
        {pending.length > 0 && (
          <GroupSection title="Pending approval" count={pending.length} tone="purple">
            {pending.map((b) => (
              <BookingRow key={b.id} booking={b} onOpen={openDetails} />
            ))}
          </GroupSection>
        )}

        {/* Confirmed upcoming */}
        {confirmed.length > 0 && (
          <GroupSection title="Confirmed upcoming" count={confirmed.length} tone="emerald">
            {confirmed.map((b) => (
              <BookingRow key={b.id} booking={b} onOpen={openDetails} />
            ))}
          </GroupSection>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <GroupSection title="Completed" count={completed.length} tone="emerald">
            {completed.map((b) => (
              <BookingRow key={b.id} booking={b} onOpen={openDetails} />
            ))}
          </GroupSection>
        )}

        {pending.length + confirmed.length + completed.length === 0 && (
          <div className="bg-white border border-dashed border-neutral-200/80 rounded-2xl py-12 text-center shadow-2xs">
            <CalendarDays className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-neutral-500 font-medium">No bookings found</p>
          </div>
        )}
      </div>

      {/* Booking details dialog */}
      <BookingDetailsDialog
        booking={selected}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onAccept={handleAccept}
        onDecline={handleDecline}
        processing={processing}
      />
    </div>
  );
}
