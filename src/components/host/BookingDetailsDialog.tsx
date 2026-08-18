"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock, DollarSign, Loader2, Mail, Phone, User, Users } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BACKDROP_CLASS } from "@/lib/utils";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type ListingType = "stay" | "experience" | "transport";

// Flexible data shape — accepts a full HostBooking or a partial details object
// (e.g. dashboard activity items).
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
  pending: { bg: "#f3eafb", fg: "#5a1f9e", label: "Pending" },
  confirmed: { bg: "#E6F4EE", fg: "#2A5C3F", label: "Confirmed" },
  completed: { bg: "#f3eafb", fg: "#3D2463", label: "Completed" },
  cancelled: { bg: "#FCEBEB", fg: "#A32D2D", label: "Cancelled" },
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

// Section label

function SectionLabel({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <Icon className="h-3.5 w-3.5 text-purple" />
      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
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
    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
      <span className="flex items-center gap-2 text-[11px] font-medium text-neutral-500">
        <Icon className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
        {label}
      </span>
      <span className="text-[12px] font-semibold text-neutral-900 text-right">{value}</span>
    </div>
  );
}

// Dialog

export function BookingDetailsDialog({
  booking,
  open,
  onOpenChange,
  onAccept,
  onDecline,
  processing,
}: {
  booking: BookingDetailsData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  processing?: string | null;
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [booking?.id]);

  const canAct = Boolean(booking && booking.status === "pending" && onAccept && onDecline);

  const body = booking ? (
    <div className="flex flex-1 min-h-0 flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-neutral-200 px-5 pt-12 pb-4">
        <div className="flex items-start gap-3">
          <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-neutral-100 flex items-center justify-center text-xl font-black text-neutral-300">
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
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <span className="text-[9px] font-black uppercase tracking-wider text-purple bg-purple/10 rounded-full px-2 py-0.5">
                {TYPE_LABELS[booking.listingType]}
              </span>
              <span
                className="text-[9px] font-black uppercase tracking-wider rounded-full px-2 py-0.5"
                style={{
                  background: STATUS_BADGE[booking.status].bg,
                  color: STATUS_BADGE[booking.status].fg,
                }}
              >
                {STATUS_BADGE[booking.status].label}
              </span>
            </div>
            <h3 className="text-base font-black text-neutral-900 leading-tight">
              {booking.listingName}
            </h3>
            {booking.bookingRef && (
              <p className="text-[11px] text-neutral-400 font-semibold mt-0.5">
                Ref {booking.bookingRef}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
        {/* Guest */}
        <section>
          <SectionLabel icon={User} label="Guest" />
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3.5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-white border border-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold">
                {initials(booking.guestName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-neutral-900">{booking.guestName}</p>
                {booking.guestEmail && (
                  <a
                    href={`mailto:${booking.guestEmail}`}
                    className="flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-purple transition-colors mt-0.5 w-fit"
                  >
                    <Mail className="h-3 w-3 shrink-0" />
                    {booking.guestEmail}
                  </a>
                )}
                {booking.guestPhone && (
                  <a
                    href={`tel:${booking.guestPhone}`}
                    className="flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-purple transition-colors mt-0.5 w-fit"
                  >
                    <Phone className="h-3 w-3 shrink-0" />
                    {booking.guestPhone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Booking details */}
        <section>
          <SectionLabel icon={CalendarDays} label="Booking details" />
          <div className="rounded-xl border border-neutral-200 divide-y divide-neutral-100 overflow-hidden">
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
              value={`${booking.guests} ${booking.guests === 1 ? "person" : "people"}`}
            />
            {booking.amount != null && (
              <DetailRow
                icon={DollarSign}
                label="Total"
                value={`K${booking.amount.toLocaleString()}${booking.currency ? ` ${booking.currency}` : ""}`}
              />
            )}
          </div>
        </section>
      </div>

      {/* Pending actions */}
      {canAct && (
        <div className="shrink-0 border-t border-neutral-200 bg-white p-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => onDecline!(booking.id)}
            disabled={processing === booking.id}
            className="h-11 rounded-xl border border-rose-200 bg-rose-50 text-[13px] font-bold text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50"
          >
            {processing === booking.id ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              "Decline"
            )}
          </button>
          <button
            onClick={() => onAccept!(booking.id)}
            disabled={processing === booking.id}
            className="h-11 rounded-xl bg-emerald-600 text-white text-[13px] font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {processing === booking.id ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              "Accept booking"
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
        className="w-[min(94vw,448px)] max-w-md p-0 overflow-hidden flex flex-col max-h-[90dvh] rounded-2xl"
      >
        <DialogTitle className="sr-only">Booking details</DialogTitle>
        {body}
      </DialogContent>
    </Dialog>
  );
}
