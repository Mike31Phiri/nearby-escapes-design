"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MessageCircle,
  MoreVertical,
  PencilLine,
  Phone,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDayLabel, formatTime12h } from "@/lib/utils/calendar";
import { formatKw, getRefundInfo, useHostBookingsStore } from "@/store/hostBookingsStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ROUTES } from "@/lib/constants/routes";

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">
      {label}
    </p>
  );
}

export function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams<{ ref: string }>();
  const ref = Array.isArray(params.ref) ? params.ref[0] : params.ref;

  const booking = useHostBookingsStore((s) => s.bookings.find((b) => b.ref === ref));
  const cancelBooking = useHostBookingsStore((s) => s.cancelBooking);

  const [cancelOpen, setCancelOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!booking) {
    return (
      <div className="min-h-screen bg-background font-sans flex flex-col items-center justify-center px-6 text-center">
        <XCircle className="h-10 w-10 text-neutral-300 mb-3" />
        <p className="text-[14px] font-semibold text-neutral-700">Booking not found</p>
        <p className="text-[12px] text-neutral-400 mt-1">
          We could&apos;nt find a booking with reference {ref}.
        </p>
        <button
          onClick={() => router.push(ROUTES?.host?.bookings ?? "/host/bookings")}
          className="mt-4 h-10 rounded-xl bg-purple text-white text-[13px] font-bold px-5 hover:bg-purple-hover transition-colors shadow-xs"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  const cancelled = booking.status === "cancelled";
  const partyTotal = booking.party.adults + booking.party.children + booking.party.seniors;
  const refund = getRefundInfo(booking);
  const policyText = "Outside 48 hours = 100% refund; within 48 hours = 50% refund";

  const handleConfirmCancellation = () => {
    setProcessing(true);
    // Simulate the payment gateway reversing funds.
    setTimeout(() => {
      const updated = cancelBooking(ref);
      setProcessing(false);
      setCancelOpen(false);
      toast.success(
        updated?.refundAmount != null
          ? `Booking cancelled — ${formatKw(updated.refundAmount)} refunded`
          : "Booking cancelled",
      );
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background font-sans pb-16">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-2xl px-4 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => router.push(ROUTES?.host?.bookings ?? "/host/bookings")}
              aria-label="Back"
              className="h-9 w-9 -ml-2 rounded-lg flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-neutral-900 leading-tight">
                Booking details
              </p>
              <p className="text-[11px] text-neutral-400 font-semibold">Ref {booking.ref}</p>
            </div>
          </div>

          {/* Action Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                disabled={cancelled}
                aria-label="Booking actions"
                title={cancelled ? "Booking is closed" : "Booking actions"}
                className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center text-neutral-600 border border-neutral-200 bg-white transition-colors",
                  cancelled
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:border-purple/40 hover:text-purple",
                )}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem
                onClick={() => toast.info("Modify booking is coming soon")}
                className="gap-2"
              >
                <PencilLine className="h-4 w-4" /> Modify Booking
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setCancelOpen(true)}
                className="gap-2 text-rose-600 focus:text-rose-700"
              >
                <XCircle className="h-4 w-4" /> Cancel Booking
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.info(`Opening chat with ${booking.guestName}…`)}
                className="gap-2"
              >
                <MessageCircle className="h-4 w-4" /> Message Guest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4 space-y-4">
        {/* Success banner */}
        {cancelled && booking.refundAmount != null && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-start gap-3 animate-celebrate-pop">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-bold text-emerald-800">
                {formatKw(booking.refundAmount)} refunded to guest
              </p>
              <p className="text-[12px] text-emerald-700/70 mt-0.5">
                Cancellation email sent · Booking closed
              </p>
            </div>
          </div>
        )}

        {/* Tour + status */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-xl bg-[#FAF7F2] border border-[#E8E3DC] flex items-center justify-center text-xl sm:text-2xl">
                {booking.emoji}
              </div>
              <div className="min-w-0">
                <p className="text-sm sm:text-[15px] font-bold text-neutral-900 leading-snug">
                  {booking.listingName}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                  <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {formatDayLabel(booking.date)} ·{" "}
                  <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {formatTime12h(booking.time)}
                </p>
              </div>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] font-semibold uppercase tracking-wide",
                cancelled ? "bg-rose-50 text-rose-600 border border-rose-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200",
              )}
            >
              {cancelled ? "Cancelled" : "Confirmed"}
            </span>
          </div>
        </div>

        {/* Guest */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs">
          <SectionLabel label="Guest" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">{booking.guestName}</p>
              <p className="text-xs text-neutral-500 truncate">{booking.guestEmail}</p>
              <p className="text-xs text-neutral-500">{booking.guestPhone}</p>
            </div>
            <div className="flex items-center sm:flex-col gap-1.5">
              <a
                href={`mailto:${booking.guestEmail}`}
                className="h-8 w-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-purple hover:border-purple/40 transition-colors"
                aria-label="Email guest"
              >
                <Mail className="h-3.5 w-3.5" />
              </a>
              <a
                href={`tel:${booking.guestPhone}`}
                className="h-8 w-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-purple hover:border-purple/40 transition-colors"
                aria-label="Call guest"
              >
                <Phone className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Party */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs">
          <SectionLabel label="Party" />
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[
              { label: "Adults", value: booking.party.adults },
              { label: "Children", value: booking.party.children },
              { label: "Seniors", value: booking.party.seniors },
            ].map((p) => (
              <span
                key={p.label}
                className="rounded-lg bg-[#FAF7F2] border border-[#E8E3DC] px-2.5 py-1 text-xs font-medium text-neutral-700"
              >
                {p.value} {p.label}
              </span>
            ))}
            <span className="rounded-lg bg-purple/5 border border-purple/20 px-2.5 py-1 text-xs font-semibold text-purple flex items-center gap-1">
              <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {partyTotal} total
            </span>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs">
          <SectionLabel label="Payment" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base sm:text-lg font-bold text-neutral-900">{formatKw(booking.total)}</p>
              <p className="text-[10px] sm:text-[11px] text-neutral-400">
                {formatKw(booking.total / partyTotal)} per person
              </p>
            </div>
            <span
              className={cn(
                "rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] font-semibold uppercase tracking-wide",
                booking.paymentStatus === "paid"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200",
              )}
            >
              {booking.paymentStatus === "paid" ? "Paid" : "Pending"}
            </span>
          </div>
        </div>

        {/* Cancelled state hint */}
        {cancelled && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
            <p className="text-[12px] text-rose-700 font-medium">
              This booking is closed — no further actions available.
            </p>
          </div>
        )}
      </main>

      {/* Cancellation sheet */}
      <Sheet open={cancelOpen} onOpenChange={setCancelOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl mx-auto max-w-2xl bg-white p-0 pb-[calc(1rem+env(safe-area-inset-bottom))]"
        >
          <SheetTitle className="sr-only">Cancel booking</SheetTitle>
          <div className="px-5 pt-5 pb-2">
            <p className="text-[15px] font-black text-neutral-900">Cancel booking?</p>
            <p className="text-[12px] text-neutral-500 mt-0.5">
              Ref {booking.ref} · {booking.listingName} · {formatDayLabel(booking.date)}
            </p>
          </div>

          <div className="px-5 space-y-3">
            {/* Policy */}
            <div className="rounded-xl bg-[#FAF7F2] border border-[#E8E3DC] p-3.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
                Cancellation policy
              </p>
              <p className="text-[13px] text-neutral-700">{policyText}</p>
            </div>

            {/* Refund calculation */}
            <div className="rounded-xl border border-neutral-200 p-3.5 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-semibold text-neutral-700">
                  {refund.fullRefund ? "100% refund eligible" : "50% refund eligible"}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {refund.fullRefund
                    ? "Tour is more than 48 hours away"
                    : "Tour is within 48 hours"}
                </p>
              </div>
              <p className="text-[18px] font-black text-neutral-900">{formatKw(refund.amount)}</p>
            </div>

            {/* Processing state */}
            {processing && (
              <div className="rounded-xl bg-purple/5 border border-purple/20 p-3.5 flex items-center gap-3">
                <Loader2 className="h-4 w-4 text-purple animate-spin shrink-0" />
                <p className="text-[12px] font-semibold text-purple">
                  Reversing funds via payment gateway…
                </p>
              </div>
            )}
          </div>

          <div className="px-5 pt-4 pb-5 flex gap-3">
            <button
              onClick={() => setCancelOpen(false)}
              disabled={processing}
              className="flex-1 h-11 rounded-xl border border-neutral-200 bg-white text-[13px] font-bold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
            >
              Keep booking
            </button>
            <button
              onClick={handleConfirmCancellation}
              disabled={processing}
              className="flex-1 h-11 rounded-xl bg-rose-600 text-white text-[13px] font-bold hover:bg-rose-700 transition-colors disabled:opacity-50"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                </span>
              ) : (
                "Confirm Cancellation"
              )}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
