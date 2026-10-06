"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock, DollarSign, Loader2, Mail, Phone, User, Users } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BACKDROP_CLASS } from "@/lib/utils";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type ListingType = "stay" | "experience" | "transport";

// Flexible data shape — accepts a full HostBooking or a partial details object
export interface BookingDetailsData {
  id: string;
  listingName: string;
  listingType: ListingType;
  status: BookingStatus;
  guestName: string;
  guests: number;
  amount?: number;
  currency?: string;
  guestEmail?: string;
  guestPhone?: string;
  checkIn?: string;
  checkOut?: string;
  date?: string;
  createdAt?: string;
  bookingRef?: string;
  listingImage?: string;
}

export const STATUS_BADGE: Record<BookingStatus, { bg: string; fg: string; label: string }> = {
  pending: { bg: "rgba(107, 43, 184, 0.1)", fg: "var(--color-purple)", label: "Pending" },
  confirmed: { bg: "#ecfdf5", fg: "#047857", label: "Confirmed" },
  completed: { bg: "#f3eafb", fg: "#3D2463", label: "Completed" },
  cancelled: { bg: "#fef2f2", fg: "#b91c1c", label: "Cancelled" },
};

export const TYPE_LABELS: Record<ListingType, string> = {
  stay: "Stay",
  experience: "Experience",
  transport: "Transport",
};

export const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString("en-ZM", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const formatFullDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-ZM", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

function SectionLabel({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-2.5">
      <Icon className="h-3.5 w-3.5 text-purple" />
      <span className="text-[11px] font-semibold uppercase tracking-wide text-black-muted">
        {label}
      </span>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5">
      <span className="flex items-center gap-1.5 text-xs text-neutral-500">
        <Icon className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
        {label}
      </span>
      <span className="text-xs font-semibold text-neutral-900 text-right">{value}</span>
    </div>
  );
}

export function BookingDetailsDialog({
  booking,
  open,
  onOpenChange,
  onAccept,
  onDecline,
  onCheckIn,
  processing,
}: {
  booking: BookingDetailsData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onCheckIn?: (id: string) => void;
  processing?: string | null;
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [booking?.id]);

  const canAct = Boolean(booking && booking.status === "pending" && onAccept && onDecline);

  const body = booking ? (
    <div className="flex flex-1 min-h-0 flex-col font-sans">
      {/* Compact Header */}
      <div className="shrink-0 border-b border-neutral-200/80 px-4 sm:px-5 pt-9 sm:pt-10 pb-3 sm:pb-3.5 bg-neutral-50/60">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/80 flex items-center justify-center text-lg font-bold text-neutral-300">
            {imgError || !booking.listingImage ? (
              booking.listingName.charAt(0)
            ) : (
              <img
                src={booking.listingImage}
                alt={booking.listingName}
                className="h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
            )}
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-purple bg-purple/10 border border-purple/20 rounded-full px-2 py-0.5">
                {TYPE_LABELS[booking.listingType]}
              </span>
              <span
                className="text-[11px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 border"
                style={{
                  background: STATUS_BADGE[booking.status].bg,
                  color: STATUS_BADGE[booking.status].fg,
                  borderColor: `${STATUS_BADGE[booking.status].fg}30`,
                }}
              >
                {STATUS_BADGE[booking.status].label}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-neutral-900 leading-snug">
              {booking.listingName}
            </h3>
          </div>
        </div>
      </div>

      {/* Compact Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3.5 sm:py-4 space-y-3.5 sm:space-y-4">
        {/* Guest Information */}
        <section>
          <SectionLabel icon={User} label="Guest Information" />
          <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-3 sm:p-3.5 space-y-1.5">
            <p className="text-xs sm:text-sm font-semibold text-neutral-900 leading-tight">
              {booking.guestName}
            </p>
            {booking.guestEmail && (
              <a
                href={`mailto:${booking.guestEmail}`}
                className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-purple transition-colors truncate"
              >
                <Mail className="h-3 w-3 shrink-0 text-neutral-400" />
                <span className="truncate">{booking.guestEmail}</span>
              </a>
            )}

            {/* Call Guest Action */}
            {booking.guestPhone && (
              <div className="pt-0.5">
                <a
                  href={`tel:${booking.guestPhone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover active:scale-98 transition-all shadow-2xs"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call {booking.guestPhone}</span>
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Booking Details */}
        <section>
          <SectionLabel icon={CalendarDays} label="Reservation Summary" />
          <div className="rounded-xl border border-neutral-200/80 divide-y divide-neutral-100 overflow-hidden bg-white shadow-2xs">
            {booking.createdAt && (
              <DetailRow icon={Clock} label="Requested" value={formatFullDate(booking.createdAt)} />
            )}
            {booking.checkIn && booking.checkOut ? (
              <DetailRow
                icon={CalendarDays}
                label="Stay dates"
                value={`${formatDay(booking.checkIn)} – ${formatDay(booking.checkOut)}`}
              />
            ) : booking.date ? (
              <DetailRow icon={CalendarDays} label="Date" value={formatDay(booking.date)} />
            ) : null}
            <DetailRow
              icon={Users}
              label="Guests"
              value={`${booking.guests} ${booking.guests === 1 ? "guest" : "guests"}`}
            />
            {booking.amount != null && (
              <DetailRow
                icon={DollarSign}
                label="Total Payout"
                value={`K${booking.amount.toLocaleString()}${booking.currency ? ` ${booking.currency}` : ""}`}
              />
            )}
          </div>
        </section>
      </div>

      {/* Pending actions */}
      {canAct && (
        <div className="shrink-0 border-t border-neutral-200/80 bg-white p-3 sm:p-4 grid grid-cols-2 gap-2.5 sm:gap-3">
          <button
            onClick={() => onDecline!(booking.id)}
            disabled={processing === booking.id}
            className="h-9 sm:h-10 rounded-xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50"
          >
            {processing === booking.id ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              "Decline request"
            )}
          </button>
          <button
            onClick={() => onAccept!(booking.id)}
            disabled={processing === booking.id}
            className="h-9 sm:h-10 rounded-xl bg-purple text-white text-xs font-semibold hover:bg-purple-hover transition-colors disabled:opacity-50 shadow-xs"
          >
            {processing === booking.id ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              "Accept reservation"
            )}
          </button>
        </div>
      )}

      {/* Check In action for confirmed bookings */}
      {booking.status === "confirmed" && onCheckIn && (
        <div className="shrink-0 border-t border-neutral-200/80 bg-white p-3 sm:p-4">
          <button
            onClick={() => onCheckIn(booking.id)}
            disabled={processing === booking.id}
            className="w-full h-9 sm:h-10 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {processing === booking.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Check In Guest"
            )}
          </button>
        </div>
      )}
    </div>
  ) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName={BACKDROP_CLASS}
        className="w-[min(92vw,410px)] max-w-sm p-0 overflow-hidden flex flex-col max-h-[85dvh] rounded-2xl border border-neutral-200/80 shadow-xl"
      >
        <DialogTitle className="sr-only">Booking details</DialogTitle>
        {body}
      </DialogContent>
    </Dialog>
  );
}
