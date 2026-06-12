"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useBookingStore } from "@/store/bookingStore";

export function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingRef = searchParams.get("ref") || "";
  const status = searchParams.get("status") || "";
  const { getBookingByRef } = useBookingStore();

  const booking = useMemo(() => getBookingByRef(bookingRef), [bookingRef, getBookingByRef]);

  const isSuccess = status === "success" || (!status && !!booking);
  const isCancelled = status === "cancelled";
  const isFailed = status === "failed" || status === "error";

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
      <Navbar />

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
          <div className="bg-card border border-border/40 rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] overflow-hidden mb-6 animate-in slide-in-from-bottom-4 duration-500">
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
          <div className="bg-card border border-border/40 rounded-2xl p-8 text-center space-y-5">
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
