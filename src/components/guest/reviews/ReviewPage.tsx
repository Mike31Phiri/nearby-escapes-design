"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

import {
  Star,
  ChevronLeft,
  CheckCircle2,
  Camera,
  MessageSquare,
  MapPin,
  CalendarDays,
  Users,
  Home,
  Heart,
  Sparkles,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/store/bookingStore";
import { toast } from "sonner";

interface ReviewPageProps {
  bookingRef: string;
}

const categoryLabels = [
  { key: "cleanliness", label: "Cleanliness" },
  { key: "communication", label: "Communication" },
  { key: "value", label: "Value for money" },
  { key: "location", label: "Location" },
];

// Success tips shown after submission
const successTips = [
  { icon: Heart, text: "Your review helps other guests make better choices" },
  { icon: Sparkles, text: "Hosts love hearing from happy guests" },
  { icon: Home, text: "You can edit your review within 48 hours" },
];

export function ReviewPage({ bookingRef }: ReviewPageProps) {
  const { getBookingByRef } = useBookingStore();
  const booking = useMemo(() => getBookingByRef(bookingRef), [bookingRef, getBookingByRef]);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState<Record<string, number>>({});
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const avgCategoryRating = useMemo(() => {
    const vals = Object.values(categoryRatings);
    if (vals.length === 0) return 0;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }, [categoryRatings]);

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <h1 className="text-xl font-black tracking-tight mb-2">Booking not found</h1>
            <p className="text-muted-foreground text-base mb-6">
              We couldn&apos;t find a booking with this reference. Please check your booking details
              and try again.
            </p>
            <Link
              href="/trips"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-foreground font-bold text-base"
            >
              <Home className="h-4 w-4" /> Go to My Trips
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const setCategoryRating = (key: string, val: number) => {
    setCategoryRatings((prev) => ({ ...prev, [key]: val }));
  };

  const canSubmit = rating > 0 && content.trim().length >= 10;

  const handleSubmit = async () => {
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setSubmitting(false);
    toast.success("Review submitted! Thank you for sharing your experience.");
  };

  // Submitted state
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F9F7F2]">
        <main className="flex-1 w-full max-w-lg mx-auto px-4 md:px-6 py-16 text-center">
          <div className="animate-in zoom-in-0 duration-300">
            <div className="inline-flex h-20 w-20 rounded-full bg-emerald-500/10 items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#334155] mb-2">
              Review Submitted! 🎉
            </h1>
            <p className="text-[#64748B] text-base mb-2">
              Thank you for reviewing{" "}
              <strong className="text-[#334155]">{booking.listingName}</strong>
            </p>
            <div className="flex items-center justify-center gap-1 mt-4 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-6 w-6",
                    i < rating ? "fill-[#1f1433] text-[#1f1433]" : "fill-gray-200 text-gray-200",
                  )}
                />
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="text-left space-y-3 mb-8 animate-in slide-in-from-bottom-4 duration-500 delay-200">
            {successTips.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3 text-base text-[#64748B]">
                <Icon className="h-4 w-4 text-[#1f1433] shrink-0 mt-0.5" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in slide-in-from-bottom-4 duration-500 delay-300">
            <Link
              href="/trips"
              className="h-11 px-6 rounded-xl bg-[#f2ba0d] text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-[#3A2B4D] transition-colors"
            >
              <Home className="h-4 w-4" /> Back to My Trips
            </Link>
            <Link
              href={`/listings/${booking.type === "stay" ? "stays" : booking.type === "experience" ? "experiences" : "transport"}/${booking.listingId}`}
              className="h-11 px-6 rounded-xl border border-[#E0DBD0] text-[#334155] font-bold text-base flex items-center justify-center gap-2 hover:bg-[#F9F7F2] transition-colors"
            >
              View listing
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2]">
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-10">
        {/* Back link */}
        <Link
          href="/trips"
          className="inline-flex items-center gap-1 text-base text-[#64748B] hover:text-[#334155] transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to My Trips
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#334155] mb-2">
            Leave a review
          </h1>
          <p className="text-[#64748B] text-base">
            Share your experience to help other guests make informed choices.
          </p>
        </div>

        {/* Booking Summary Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#E0DBD0] shadow-sm mb-8">
          <div className="h-16 w-16 rounded-xl overflow-hidden bg-muted shrink-0">
            <img
              src={booking.image}
              alt={booking.listingName}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base text-[#334155] line-clamp-1">{booking.listingName}</p>
            <p className="text-sm text-[#64748B] flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" />
              {booking.location}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-[#64748B] mt-1">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {booking.details.checkIn
                  ? new Date(booking.details.checkIn).toLocaleDateString("en-ZM", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {booking.details.guests} guest{booking.details.guests > 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1f1433] bg-[#f2ba0d]/10 px-2.5 py-1 rounded-full shrink-0">
            {booking.type === "stay"
              ? "Stay"
              : booking.type === "experience"
                ? "Experience"
                : "Transport"}
          </span>
        </div>

        {/* Overall Rating */}
        <div className="bg-white border border-[#E0DBD0] rounded-2xl p-6 shadow-sm mb-4">
          <h2 className="font-bold text-[#334155] text-base mb-1">Overall rating</h2>
          <p className="text-sm text-[#64748B] mb-4">Tap a star to rate your experience</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform duration-150 hover:scale-110 active:scale-95"
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              >
                <Star
                  className={cn(
                    "h-10 w-10 md:h-12 md:w-12 transition-all duration-150",
                    (hoverRating || rating) >= star
                      ? "fill-[#1f1433] text-[#1f1433] drop-shadow-sm"
                      : "fill-gray-200 text-gray-200 hover:fill-gray-300",
                  )}
                />
              </button>
            ))}
            <span className="text-base font-bold text-[#334155] ml-2">
              {rating > 0 ? `${rating}/5` : ""}
            </span>
          </div>
        </div>

        {/* Category Ratings */}
        <div className="bg-white border border-[#E0DBD0] rounded-2xl p-6 shadow-sm mb-4">
          <h2 className="font-bold text-[#334155] text-base mb-3">Rate specific aspects</h2>
          <div className="space-y-4">
            {categoryLabels.map(({ key, label }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-[#64748B]">{label}</span>
                  <span className="text-[10px] font-bold text-[#334155]">
                    {categoryRatings[key] ? `${categoryRatings[key]}/5` : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCategoryRating(key, star)}
                      className="transition-transform duration-150 hover:scale-110"
                      aria-label={`${label}: ${star} star${star > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={cn(
                          "h-6 w-6 transition-all duration-150",
                          (categoryRatings[key] || 0) >= star
                            ? "fill-[#1f1433] text-[#1f1433]"
                            : "fill-gray-200 text-gray-200",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {avgCategoryRating > 0 && (
            <p className="text-sm text-[#64748B] mt-3 text-center">
              Average: <strong className="text-[#334155]">{avgCategoryRating.toFixed(1)}</strong>/5
            </p>
          )}
        </div>

        {/* Written Review */}
        <div className="bg-white border border-[#E0DBD0] rounded-2xl p-6 shadow-sm mb-4">
          <h2 className="font-bold text-[#334155] text-base mb-1">Your review</h2>
          <p className="text-sm text-[#64748B] mb-3">
            What did you like or dislike? What stood out about your experience?
          </p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="Share the details of your experience — the good, the unexpected, and the unforgettable..."
            className="w-full rounded-xl border border-[#E0DBD0] bg-[#F9F7F2] px-4 py-3 text-base text-[#334155] placeholder:text-[#64748B]/50 focus:outline-none focus:ring-2 focus:ring-[#1f1433]/30 focus:border-[#1f1433] resize-none transition-all"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-[#64748B]">{content.length} / 5000 characters</span>
            {content.trim().length < 10 && content.length > 0 && (
              <span className="text-[11px] text-rose-500 font-medium">Minimum 10 characters</span>
            )}
          </div>
        </div>

        {/* Add Photos (placeholder) */}
        <div className="bg-white border border-[#E0DBD0] rounded-2xl p-6 shadow-sm mb-4">
          <h2 className="font-bold text-[#334155] text-base mb-1">Add photos (optional)</h2>
          <p className="text-sm text-[#64748B] mb-3">
            Show off your experience — photos make reviews more helpful
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toast.success("Photo upload coming soon!")}
              className="flex items-center justify-center h-20 w-20 rounded-xl border-2 border-dashed border-[#E0DBD0] hover:border-[#1f1433]/50 hover:bg-[#f2ba0d]/5 transition-all text-[#64748B] hover:text-[#1f1433]"
            >
              <Camera className="h-6 w-6" />
            </button>
            <span className="text-[11px] text-[#64748B]">Upload up to 5 photos</span>
          </div>
        </div>

        {/* Display Name */}
        <div className="bg-white border border-[#E0DBD0] rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-bold text-[#334155] text-base mb-1">Display name</h2>
          <p className="text-sm text-[#64748B] mb-3">
            This name will appear publicly with your review
          </p>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Your name or nickname"
            className="w-full rounded-xl border border-[#E0DBD0] bg-[#F9F7F2] px-4 py-2.5 text-base text-[#334155] placeholder:text-[#64748B]/50 focus:outline-none focus:ring-2 focus:ring-[#1f1433]/30 focus:border-[#1f1433] transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className={cn(
            "w-full h-12 rounded-xl font-black text-base flex items-center justify-center gap-2 transition-all duration-200",
            canSubmit && !submitting
              ? "bg-[#f2ba0d] text-white hover:bg-[#3A2B4D] shadow-md shadow-[#1f1433]/20 hover:shadow-lg hover:-translate-y-0.5"
              : "bg-gray-200 text-gray-400 cursor-not-allowed",
            submitting && "opacity-70",
          )}
        >
          {submitting ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Review
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-[#64748B] mt-3">
          Your review will be visible on the listing page after moderation
        </p>
      </main>
    </div>
  );
}
