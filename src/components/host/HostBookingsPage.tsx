"use client";

import { useCallback, useState } from "react";
import { Eye } from "lucide-react";
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

/* ------------------------- Request row ------------------------- */

function BookingRow({
  booking,
  onOpen,
}: {
  booking: HostBooking;
  onOpen: (booking: HostBooking) => void;
}) {
  const badge = STATUS_BADGE[booking.status];

  return (
    <div className="flex items-center gap-2.5 px-3 py-3 transition-colors hover:bg-neutral-50">
      <button
        onClick={() => onOpen(booking)}
        aria-label={`View details for ${booking.guestName}`}
        className="flex items-center gap-2.5 flex-1 min-w-0 text-left outline-none"
      >
        <div className="h-9 w-9 shrink-0 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center text-[11px] font-bold">
          {initials(booking.guestName)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-semibold text-neutral-900 truncate">
            {booking.guestName}{" "}
            <span className="text-neutral-400 font-medium">
              · {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
            </span>
          </div>
          <div className="text-[10px] text-neutral-500 truncate">{booking.listingName}</div>
          <div className="text-[10px] text-neutral-400 truncate">
            {bookingDates(booking)} · K{booking.amount.toLocaleString()}
          </div>
        </div>
      </button>
      <span
        className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0"
        style={{ background: badge.bg, color: badge.fg }}
      >
        {badge.label}
      </span>
      <button
        onClick={() => onOpen(booking)}
        aria-label={`View details for booking ${booking.bookingRef}`}
        className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-purple hover:border-purple/40 hover:bg-purple/5 transition-colors outline-none"
      >
        <Eye className="h-3.5 w-3.5" />
        View details
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
    <div className="mb-4 last:mb-0">
      <div className="flex items-center gap-2 mb-2">
        <div
          className={cn(
            "w-[26px] h-[26px] rounded-lg flex items-center justify-center",
            tone === "purple" ? "bg-[#f3eafb]" : "bg-emerald-50",
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              tone === "purple" ? "bg-purple" : "bg-emerald-600",
            )}
          />
        </div>
        <span className="text-[12px] font-medium text-neutral-900">
          {title} ({count})
        </span>
      </div>
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------ Main page ------------------------------- */

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
    <div className="min-h-screen bg-neutral-50">
      <HostPageHeader
        title="Bookings"
        description="View and manage all your upcoming and past guest stays."
      />
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6">
        {/* Pending approval */}
        {pending.length > 0 && (
          <div className="mb-6">
            <GroupSection title="Pending approval" count={pending.length} tone="purple">
              {pending.map((b) => (
                <BookingRow key={b.id} booking={b} onOpen={openDetails} />
              ))}
            </GroupSection>
          </div>
        )}

        {/* Confirmed upcoming */}
        {confirmed.length > 0 && (
          <div className="mb-6">
            <GroupSection title="Confirmed upcoming" count={confirmed.length} tone="emerald">
              {confirmed.map((b) => (
                <BookingRow key={b.id} booking={b} onOpen={openDetails} />
              ))}
            </GroupSection>
          </div>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <div className="mb-6">
            <GroupSection title="Completed" count={completed.length} tone="emerald">
              {completed.map((b) => (
                <BookingRow key={b.id} booking={b} onOpen={openDetails} />
              ))}
            </GroupSection>
          </div>
        )}

        {pending.length + confirmed.length + completed.length === 0 && (
          <div className="bg-white border border-dashed border-neutral-200 rounded-2xl py-10 text-center">
            <p className="text-[12px] text-neutral-400 font-medium">No bookings found</p>
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
