"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  MapPin,
  CalendarDays,
  Users,
  CreditCard,
  Download,
  Share2,
  Home,
  Search,
  ArrowLeft,
  Star,
  Mail,
  User,
  CheckCheck,
  MessageSquare,
  Phone,
  Clock,
  ChevronRight,
  ExternalLink,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store/bookingStore";
import { toast } from "sonner";

export function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailTimestamp, setEmailTimestamp] = useState<string | null>(null);
  const bookingRef = searchParams.get("ref") || "";
  const status = searchParams.get("status") || "";
  const { getBookingByRef } = useBookingStore();

  const booking = useMemo(() => getBookingByRef(bookingRef), [bookingRef, getBookingByRef]);

  const isSuccess = status === "success" || (!status && !!booking);
  const isCancelled = status === "cancelled";
  const isFailed = status === "failed" || status === "error";

  // Auto-simulate email receipt on page load for successful bookings
  useEffect(() => {
    if (isSuccess && booking) {
      const timer = setTimeout(() => {
        setEmailSent(true);
        setEmailTimestamp(
          new Date().toLocaleTimeString("en-ZM", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        );
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, booking]);

  if (!bookingRef && !status) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--color-bg)] font-sans">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="h-16 w-16 rounded-full bg-black/[0.04] flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-black-faint" />
            </div>
            <h1 className="text-xl font-black tracking-tight mb-2 text-black">
              No booking reference found
            </h1>
            <p className="text-black-faint text-base mb-6">
              This page is for viewing booking confirmations. Please use a valid booking link.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-purple text-white font-bold text-base"
            >
              <Home className="h-4 w-4" /> Go to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] font-sans">
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Status Icon & Title */}
        <div className="text-center mb-8 animate-in fade-in duration-500">
          {isSuccess ? (
            <div className="inline-flex h-20 w-20 rounded-full bg-emerald-500/10 items-center justify-center mb-5 animate-in zoom-in-0 duration-500 delay-100">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
          ) : (
            <div className="inline-flex h-20 w-20 rounded-full bg-red-500/10 items-center justify-center mb-5">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
            {isSuccess
              ? "You're all set! 🎉"
              : isCancelled
                ? "Booking Cancelled"
                : "Payment Failed"}
          </h1>
          <p className="text-neutral-500 text-sm md:text-base max-w-md mx-auto font-normal">
            {isSuccess
              ? "Your booking has been confirmed. A confirmation email has been sent to your inbox."
              : isCancelled
                ? "The payment was cancelled. No charges have been made."
                : "We were unable to process your payment. Please try again."}
          </p>
        </div>

        {/* Booking Details Card */}
        {booking && isSuccess && (
          <div className="bg-white border border-black/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden mb-6 animate-in slide-in-from-bottom-4 duration-500 delay-200">
            {/* Listing Image Header */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={booking.image}
                alt={booking.listingName}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5">
                <span className="text-[10px] font-medium uppercase tracking-wider bg-emerald-500 text-white px-2.5 py-0.5 rounded-full mb-2 inline-block">
                  {booking.type === "stay"
                    ? "Accommodation"
                    : booking.type === "experience"
                      ? "Experience"
                      : "Transport"}
                </span>
                <h2 className="font-semibold text-white text-xl leading-snug">
                  {booking.listingName}
                </h2>
                <p className="text-white/80 text-xs sm:text-sm flex items-center gap-1 mt-0.5 font-normal">
                  <MapPin className="h-3 w-3" />
                  {booking.location}
                </p>
              </div>
            </div>

            <div className="p-5 md:p-6 space-y-5">
              {/* Booking Reference */}
              <div className="bg-purple/[0.04] border border-purple/10 rounded-xl px-4 py-3.5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                    Booking Reference
                  </p>
                  <p className="font-mono font-semibold text-xl text-neutral-900 mt-0.5">
                    {booking.bookingRef}
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(booking.bookingRef);
                    toast.success("Reference copied!");
                  }}
                  className="flex items-center gap-1.5 text-xs text-purple font-bold uppercase tracking-wider hover:underline px-3 py-1.5 rounded-lg bg-purple/5"
                >
                  <Copy className="h-3 w-3" />
                  Copy
                </button>
              </div>

              {/* Trip Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <DetailCard
                  icon={<CalendarDays className="h-3.5 w-3.5" />}
                  label={booking.details.checkIn ? "Check-In" : "Date"}
                  value={
                    booking.details.checkIn
                      ? new Date(booking.details.checkIn).toLocaleDateString("en-ZM", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : booking.details.date
                        ? new Date(booking.details.date).toLocaleDateString("en-ZM", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"
                  }
                />
                {booking.details.checkOut && (
                  <DetailCard
                    icon={<CalendarDays className="h-3.5 w-3.5" />}
                    label="Check-Out"
                    value={new Date(booking.details.checkOut).toLocaleDateString("en-ZM", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  />
                )}
                <DetailCard
                  icon={<Users className="h-3.5 w-3.5" />}
                  label="Guests"
                  value={`${booking.details.guests} guest${booking.details.guests > 1 ? "s" : ""}`}
                />
                <DetailCard
                  icon={<CreditCard className="h-3.5 w-3.5" />}
                  label="Total Paid"
                  value={`K${booking.amount.toLocaleString()}`}
                  highlight
                />
              </div>

              <div className="h-px bg-black/[0.06]" />

              {/* Customer Details */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-black-faint mb-2">
                  Booked By
                </p>
                <p className="text-sm font-semibold text-black">{booking.customerName}</p>
                <p className="text-sm text-black-faint">{booking.customerPhone}</p>
              </div>

              {/* Extras */}
              {booking.details.extras && Object.keys(booking.details.extras).length > 0 && (
                <>
                  <div className="h-px bg-black/[0.06]" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-black-faint mb-2">
                      Extras Selected
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(booking.details.extras).map(([key, val]) => (
                        <span
                          key={key}
                          className="text-[11px] font-medium bg-black/[0.04] px-2.5 py-1 rounded-full text-black-soft"
                        >
                          {key.replace(/([A-Z])/g, " $1").trim()}: {String(val)}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="h-px bg-black/[0.06]" />

              {/* What's Next Section */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-black-faint mb-3">
                  What happens next
                </p>
                <div className="space-y-3">
                  <NextStep
                    icon={<Mail className="h-4 w-4 text-emerald-600" />}
                    iconBg="bg-emerald-500/10"
                    title="Check your email"
                    desc="We've sent a detailed confirmation to your inbox"
                    step={1}
                  />
                  <NextStep
                    icon={<MessageSquare className="h-4 w-4 text-purple" />}
                    iconBg="bg-purple/10"
                    title="Message your host"
                    desc="Introduce yourself and share any arrival details"
                    step={2}
                  />
                  <NextStep
                    icon={<CalendarDays className="h-4 w-4 text-[var(--color-yellow)]" />}
                    iconBg="bg-[var(--color-yellow)]/10"
                    title="Prepare for your trip"
                    desc="Review the listing details and pack your bags!"
                    step={3}
                  />
                </div>
              </div>

              <div className="h-px bg-black/[0.06]" />

              {/* Email Receipt Section */}
              <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-black">Booking Receipt</h3>
                  </div>
                  {emailSent && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCheck className="h-3 w-3" />
                      Delivered
                    </span>
                  )}
                </div>

                {/* Guest receipt line */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/70 mb-1.5">
                  <div className="w-7 h-7 rounded-full bg-purple/10 flex items-center justify-center shrink-0">
                    <Mail className="h-3.5 w-3.5 text-purple" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-black">Confirmation to you</p>
                    <p className="text-[10px] text-black-faint truncate">
                      {booking.customerEmail || "guest@email.com"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {emailSent ? (
                      <span className="text-[9px] text-emerald-600 font-medium block">
                        {emailTimestamp}
                      </span>
                    ) : sendingEmail ? (
                      <div className="h-3 w-3 rounded-full border-2 border-emerald-300 border-t-emerald-600 animate-spin" />
                    ) : null}
                  </div>
                </div>

                {/* Host receipt line */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/70">
                  <div className="w-7 h-7 rounded-full bg-[var(--color-yellow)]/10 flex items-center justify-center shrink-0">
                    <User className="h-3.5 w-3.5 text-black" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-black">Notification to host</p>
                    <p className="text-[10px] text-black-faint truncate">
                      {booking.hostName || "Chanda Bwalya"} (
                      {booking.hostEmail || "chanda@nearbyescapes.com"})
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {emailSent ? (
                      <span className="text-[9px] text-emerald-600 font-medium block">
                        {emailTimestamp}
                      </span>
                    ) : sendingEmail ? (
                      <div className="h-3 w-3 rounded-full border-2 border-emerald-300 border-t-emerald-600 animate-spin" />
                    ) : null}
                  </div>
                </div>

                {!emailSent && (
                  <button
                    onClick={async () => {
                      setSendingEmail(true);
                      await new Promise((r) => setTimeout(r, 1500));
                      setSendingEmail(false);
                      setEmailSent(true);
                      setEmailTimestamp(
                        new Date().toLocaleTimeString("en-ZM", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                      );
                      toast.success("Receipt sent to guest and host");
                    }}
                    disabled={sendingEmail}
                    className="mt-3 w-full h-9 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    {sendingEmail ? (
                      <>
                        <div className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-3.5 w-3.5" />
                        Send Receipt
                      </>
                    )}
                  </button>
                )}

                {emailSent && (
                  <div className="mt-3 pt-2.5 border-t border-emerald-100">
                    <div className="flex items-center gap-2 text-[10px] text-emerald-700 font-medium">
                      <CheckCheck className="h-3.5 w-3.5" />
                      <span>Receipt delivered to guest and host</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Button
                  variant="outline"
                  className="flex-1 h-11 rounded-xl border-black/[0.12] font-semibold"
                  onClick={() => {
                    const text = `Booking Confirmed! 🎉\nRef: ${booking.bookingRef}\n${booking.listingName}\n${booking.location}\nAmount: K${booking.amount.toLocaleString()}`;
                    navigator.clipboard?.writeText(text);
                    toast.success("Booking details copied!");
                  }}
                >
                  <Copy className="h-4 w-4 mr-1.5" />
                  Copy Details
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-11 rounded-xl border-black/[0.12] font-semibold"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `Booking Confirmed: ${booking.listingName}`,
                        text: `I just booked ${booking.listingName} on Nearby Escapes! Ref: ${booking.bookingRef}`,
                      });
                    } else {
                      toast.info("Share not supported on this device");
                    }
                  }}
                >
                  <Share2 className="h-4 w-4 mr-1.5" />
                  Share
                </Button>
                <Link
                  href={`/account/reviews/${booking.bookingRef}`}
                  className="flex-1 h-11 rounded-xl border border-black/[0.12] font-semibold flex items-center justify-center gap-1.5 hover:bg-black/[0.02] transition-colors text-sm"
                >
                  <Star className="h-4 w-4 fill-[var(--color-yellow)] text-[var(--color-yellow)]" />
                  Leave a Review
                </Link>
              </div>

              <Link
                href="/"
                className="w-full h-11 rounded-xl bg-purple hover:bg-purple-hover text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </div>
        )}

        {/* Failed / Cancelled state */}
        {(!isSuccess || !booking) && (
          <div className="bg-white border border-black/[0.06] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8 text-center space-y-5">
            <div className="space-y-2">
              <p className="text-black-faint text-base">
                {isCancelled
                  ? "You have cancelled the payment. Your booking has not been processed and no charges have been made."
                  : "Your payment could not be processed. This could be due to insufficient funds, network issues, or a declined transaction."}
              </p>
              {bookingRef && (
                <p className="text-sm text-black-faint">
                  Reference:{" "}
                  <span className="font-mono font-semibold text-black">{bookingRef}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                className="h-11 rounded-xl border-black/[0.12]"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Link
                href="/"
                className="h-11 rounded-xl bg-purple text-white font-bold text-sm inline-flex items-center justify-center gap-2 px-5"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </div>
          </div>
        )}

        {/* Support */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-black-faint">Need help with your booking?</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <a
              href="mailto:support@nearbyescapes.com"
              className="text-purple font-semibold hover:underline flex items-center gap-1.5"
            >
              <Mail className="h-3.5 w-3.5" />
              Email Support
            </a>
            <span className="text-black-faint/30">|</span>
            <a
              href="tel:+260970000000"
              className="text-purple font-semibold hover:underline flex items-center gap-1.5"
            >
              <Phone className="h-3.5 w-3.5" />
              +260 97 000 0000
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-components

function DetailCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-3 rounded-xl border ${
        highlight
          ? "bg-purple/[0.04] border-purple/10"
          : "bg-[var(--color-white-soft)] border-black/[0.04]"
      }`}
    >
      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-black-faint mb-1">
        {icon}
        {label}
      </div>
      <p className={`text-sm font-bold ${highlight ? "text-purple" : "text-black"}`}>{value}</p>
    </div>
  );
}

function NextStep({
  icon,
  iconBg,
  title,
  desc,
  step,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
  step: number;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="relative">
        <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-black">{title}</p>
        <p className="text-[11px] text-black-faint mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
