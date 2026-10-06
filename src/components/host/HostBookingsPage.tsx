"use client";

import { useCallback, useState, useMemo } from "react";
import Link from "next/link";
import { Eye, CalendarDays, FileText } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { mockHostBookings } from "@/lib/mock-host-bookings";
import type { HostBooking } from "@/lib/mock-host-bookings";
import { HostPageHeader } from "@/components/layout/HostPageHeader";
import { BookingDetailsDialog, STATUS_BADGE, formatDay, initials } from "./BookingDetailsDialog";
import { useBookingStore } from "@/store/bookingStore";
import { checkInGuest } from "@/lib/api/host";

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
        className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full tracking-wide whitespace-nowrap shrink-0 border"
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
  const userBookings = useBookingStore((s) => s.bookings);

  // Merge store bookings with initial host bookings
  const allBookings = useMemo(() => {
    const fromStore: HostBooking[] = userBookings.map((b) => ({
      id: b.id,
      bookingRef: b.bookingRef,
      listingId: b.listingId || "listing-1",
      listingName: b.listingName,
      listingType: (b.type || "stay") as any,
      status: (b.status === "cancelled" ? "cancelled" : "confirmed") as any,
      guestName: b.customerName || "Mike Phiri",
      guestAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(b.customerName || "Mike Phiri")}`,
      guests: b.details?.guests || 1,
      amount: b.amount,
      currency: b.currency || "ZMW",
      guestEmail: b.customerEmail || "guest@nearbyescapes.com",
      guestPhone: b.customerPhone || "+260 97 1234567",
      checkIn: b.details?.checkIn,
      checkOut: b.details?.checkOut,
      date: b.details?.date,
      createdAt: b.createdAt,
      updatedAt: b.createdAt,
      listingImage: b.image,
    }));

    const overriddenIds = new Set(bookings.map((b) => b.id));
    const newFromStore = fromStore.filter((b) => !overriddenIds.has(b.id));
    return [...newFromStore, ...bookings];
  }, [userBookings, bookings]);

  const pending = allBookings.filter((b) => b.status === "pending");
  const confirmed = allBookings.filter((b) => b.status === "confirmed");
  const completed = allBookings.filter((b) => b.status === "completed");

  const openDetails = useCallback((booking: HostBooking) => {
    setSelected(booking);
    setDetailsOpen(true);
  }, []);

  const handleCheckIn = useCallback(
    async (id: string) => {
      const guest = allBookings.find((b) => b.id === id);
      setProcessing(id);
      try {
        await checkInGuest(id);
      } catch (e) {
        console.warn("Backend check-in sync note:", e);
      }
      setBookings((prev) => {
        const exists = prev.some((b) => b.id === id);
        if (exists) {
          return prev.map((b) => (b.id === id ? { ...b, status: "completed" as const } : b));
        }
        if (guest) {
          return [{ ...guest, status: "completed" as const }, ...prev];
        }
        return prev;
      });
      setProcessing(null);
      setDetailsOpen(false);
      toast.success(`Check-in confirmed for ${guest?.guestName ?? "Guest"}! Funds released.`);
    },
    [allBookings],
  );

  const handleAccept = useCallback(
    (id: string) => {
      const guest = allBookings.find((b) => b.id === id);
      setProcessing(id);
      setTimeout(() => {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "confirmed" as const } : b)),
        );
        setProcessing(null);
        toast.success(`Booking confirmed for ${guest?.guestName ?? "Guest"}!`);
      }, 800);
    },
    [allBookings],
  );

  const handleDecline = useCallback(
    (id: string) => {
      const guest = allBookings.find((b) => b.id === id);
      setProcessing(id);
      setTimeout(() => {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b)),
        );
        setProcessing(null);
        toast.success(`Booking from ${guest?.guestName ?? "Guest"} declined.`);
      }, 800);
    },
    [allBookings],
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
        onCheckIn={handleCheckIn}
        processing={processing}
      />
    </div>
  );
}
