"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
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
      <div className="min-h-screen flex flex-col bg-background font-sans">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h1 className="text-xl font-black tracking-tight mb-2">No booking reference found</h1>
            <p className="text-muted-foreground text-sm mb-6">
              This page is for viewing booking confirmations. Please use a valid booking link.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
            >
              <Home className="h-4 w-4" /> Go to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 md:px-6 py-12">
        {/* Status Icon */}
        <div className="text-center mb-8">
          {isSuccess ? (
            <div className="inline-flex h-20 w-20 rounded-full bg-emerald-500/10 items-center justify-center mb-4 animate-in zoom-in-0 duration-300">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
          ) : (
            <div className="inline-flex h-20 w-20 rounded-full bg-destructive/10 items-center justify-center mb-4">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground mb-2">
            {isSuccess
              ? "Booking Confirmed! 🎉"
              : isCancelled
                ? "Booking Cancelled"
                : "Payment Failed"}
          </h1>
          <p className="text-muted-foreground">
            {isSuccess
              ? "Your reservation has been confirmed and is now being processed."
              : isCancelled
                ? "The payment was cancelled. No charges have been made."
                : "We were unable to process your payment. Please try again."}
          </p>
        </div>

        {/* Booking Details Card */}
        {booking && isSuccess && (
          <div className="bg-card border border-border/40 rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] card-shadow-lg overflow-hidden mb-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Listing Image Header */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={booking.image}
                alt={booking.listingName}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5">
                <span className="text-xs font-bold uppercase tracking-widest bg-emerald-500 text-white px-2.5 py-0.5 rounded-full mb-2 inline-block">
                  {booking.type === "stay"
                    ? "Accommodation"
                    : booking.type === "experience"
                      ? "Experience"
                      : "Transport"}
                </span>
                <h2 className="font-black text-white text-lg">{booking.listingName}</h2>
                <p className="text-white/70 text-sm flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {booking.location}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Booking Reference */}
              <div className="bg-primary/5 border border-primary/10 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Booking Reference
                  </p>
                  <p className="font-mono font-black text-lg text-foreground">
                    {booking.bookingRef}
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(booking.bookingRef);
                  }}
                  className="text-xs text-primary font-bold uppercase tracking-wider hover:underline"
                >
                  Copy
                </button>
              </div>

              {/* Trip Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {booking.details.checkIn ? "Check-In" : "Date"}
                  </p>
                  <p className="font-semibold text-sm text-foreground">
                    {booking.details.checkIn
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
                        : "—"}
                  </p>
                </div>
                {booking.details.checkOut && (
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Check-Out
                    </p>
                    <p className="font-semibold text-sm text-foreground">
                      {new Date(booking.details.checkOut).toLocaleDateString("en-ZM", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    Guests
                  </p>
                  <p className="font-semibold text-sm text-foreground">
                    {booking.details.guests} guest{booking.details.guests > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5" />
                    Paid
                  </p>
                  <p className="font-semibold text-sm text-foreground">
                    K{booking.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="h-px bg-border/40" />

              {/* Customer Details */}
              <div className="space-y-2 text-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Booked By
                </p>
                <p className="text-foreground font-medium">{booking.customerName}</p>
                <p className="text-muted-foreground">{booking.customerPhone}</p>
              </div>

              {/* Extras */}
              {booking.details.extras && Object.keys(booking.details.extras).length > 0 && (
                <>
                  <div className="h-px bg-border/40" />
                  <div className="space-y-2 text-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Extras Selected
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(booking.details.extras).map(([key, val]) => (
                        <span
                          key={key}
                          className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground"
                        >
                          {key.replace(/([A-Z])/g, " $1").trim()}: {val}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Email Receipt Section */}
              <div className="rounded-xl bg-[#F0FAF4] border border-[#2A7A3A]/20 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-xs font-bold text-[#334155]">Booking Receipt</h3>
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
                  <div className="w-7 h-7 rounded-full bg-[#1A0B2E]/10 flex items-center justify-center shrink-0">
                    <Mail className="h-3.5 w-3.5 text-[#1A0B2E]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-foreground">Confirmation to you</p>
                    <p className="text-[10px] text-muted-foreground truncate">
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
                  <div className="w-7 h-7 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                    <User className="h-3.5 w-3.5 text-[#D4AF37]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-foreground">
                      Notification to host
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
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
                    className="mt-3 w-full h-8 rounded-lg bg-[#1A0B2E] text-[#F9F7F2] text-[10px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#1A0B2E]/90 transition-colors disabled:opacity-50"
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
                    <div className="flex items-center gap-2 text-[10px] text-emerald-700">
                      <CheckCheck className="h-3.5 w-3.5" />
                      <span>Receipt delivered to guest and host</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 h-11 rounded-xl"
                  onClick={() => {
                    const text = `Booking Confirmed! 🎉\nRef: ${booking.bookingRef}\n${booking.listingName}\n${booking.location}\nAmount: K${booking.amount.toLocaleString()}`;
                    navigator.clipboard?.writeText(text);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Copy Details
                </Button>
                <Link
                  href={`/reviews/${booking.bookingRef}`}
                  className="flex-1 h-11 rounded-xl border border-[#D4AF37]/40 text-[#334155] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#D4AF37]/5 transition-colors"
                >
                  <Star className="h-4 w-4 text-[#D4AF37] fill-[#D4AF37]" />
                  Leave a Review
                </Link>
                <Link
                  href="/"
                  className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Failed / Cancelled state */}
        {(!isSuccess || !booking) && (
          <div className="bg-card border border-border/40 rounded-2xl shadow-sm card-shadow p-8 text-center space-y-5">
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                {isCancelled
                  ? "You have cancelled the payment. Your booking has not been processed and no charges have been made."
                  : "Your payment could not be processed. This could be due to insufficient funds, network issues, or a declined transaction."}
              </p>
              {bookingRef && (
                <p className="text-xs text-muted-foreground">
                  Reference: <span className="font-mono font-semibold">{bookingRef}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" className="h-11 rounded-xl" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Link
                href="/"
                className="h-11 rounded-xl bg-primary text-primary-foreground font-bold text-sm inline-flex items-center justify-center gap-2 px-5"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </div>
          </div>
        )}

        {/* Support */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            Need help? Contact our support team at{" "}
            <a
              href="mailto:support@nearbyescapes.com"
              className="text-primary underline underline-offset-2"
            >
              support@nearbyescapes.com
            </a>{" "}
            or call{" "}
            <a href="tel:+260970000000" className="text-primary underline underline-offset-2">
              +260 97 000 0000
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
