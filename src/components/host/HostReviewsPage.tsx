"use client";

import { useState } from "react";
import {
  Star,
  Plus,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Send,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";
import { HostPageHeader } from "@/components/layout/HostPageHeader";
import { mockHostReviews, mockDisputes } from "@/lib/mock-host-inbox";
import type { HostReview, Dispute } from "@/lib/mock-host-inbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            "h-4 w-4",
            s <= rating ? "fill-amber-400 text-amber-400" : "fill-neutral-200 text-neutral-200",
          )}
        />
      ))}
    </div>
  );
}

export function HostReviewsPage() {
  const [reviews, setReviews] = useState<HostReview[]>(mockHostReviews);
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes);
  const [filter, setFilter] = useState<"all" | "needs-reply" | "5-star">("all");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeBookingId, setDisputeBookingId] = useState("");
  const [disputeReason, setDisputeReason] = useState("");

  const avgRating =
    reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 5.0;

  const filteredReviews = reviews.filter((r) => {
    if (filter === "needs-reply") return !r.replied;
    if (filter === "5-star") return r.rating === 5;
    return true;
  });

  const handleSendReply = (reviewId: string) => {
    if (!replyDraft.trim()) {
      toast.error("Please type your response before sending");
      return;
    }

    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, replied: true, replyText: replyDraft.trim() } : r,
      ),
    );

    setReplyingToId(null);
    setReplyDraft("");
    toast.success("Your public response has been published to the listing");
  };

  const handleCreateDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeBookingId.trim() || !disputeReason.trim()) {
      toast.error("Please complete all dispute fields");
      return;
    }

    setIsSubmittingDispute(true);
    setTimeout(() => {
      const newDispute: Dispute = {
        id: `disp-${Date.now().toString().slice(-4)}`,
        guestName: "Direct Booking Guest",
        listingName: "Selected Listing",
        issue: disputeReason.trim(),
        amount: 500,
        date: new Date().toISOString().split("T")[0],
        status: "open",
        guestInitiative: false,
      };

      setDisputes((prev) => [newDispute, ...prev]);
      setShowDisputeModal(false);
      setDisputeBookingId("");
      setDisputeReason("");
      setIsSubmittingDispute(false);
      toast.success("Dispute escalation submitted to Nearby Escapes support");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background pb-16 font-sans">
      <HostPageHeader
        title="Reviews & Resolution"
        description="Monitor verified guest feedback, publish replies, and manage platform support cases"
        actions={
          <button
            onClick={() => setShowDisputeModal(true)}
            className="inline-flex items-center justify-center gap-2 bg-purple hover:bg-purple-hover text-white text-sm font-semibold h-11 px-5 rounded-xl shadow-xs transition-all duration-200"
          >
            <Plus className="h-4 w-4" /> Open Support Case
          </button>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-8 space-y-8">
        {/* Rating & Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Main Score Card */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Overall Host Rating
              </span>
              <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="my-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tight text-neutral-900">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-sm text-neutral-500 font-medium">/ 5.0</span>
              </div>
              <div className="mt-2">
                <StarRating rating={Math.round(avgRating)} />
              </div>
            </div>

            <div className="text-xs text-neutral-500 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple" />
              Based on {reviews.length} verified stays across your listings
            </div>
          </div>

          {/* Sub-criteria progress bars */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-4">
                Hospitality Standards
              </span>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-neutral-600 mb-1">
                    <span className="font-medium">Cleanliness</span>
                    <span className="font-bold text-neutral-900">4.9</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple rounded-full w-[98%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-neutral-600 mb-1">
                    <span className="font-medium">Accuracy & Amenities</span>
                    <span className="font-bold text-neutral-900">4.8</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple rounded-full w-[96%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-neutral-600 mb-1">
                    <span className="font-medium">Communication</span>
                    <span className="font-bold text-neutral-900">5.0</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-neutral-600 mb-1">
                    <span className="font-medium">Location & Check-in</span>
                    <span className="font-bold text-neutral-900">4.9</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple rounded-full w-[98%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Response metrics card */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Host Response Health
              </span>
              <div className="h-9 w-9 rounded-xl bg-purple/10 text-purple flex items-center justify-center">
                <MessageSquare className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="my-3 space-y-3">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-between">
                <span className="text-xs text-neutral-600 font-medium">Pending replies</span>
                <span className="text-sm font-bold text-purple">
                  {reviews.filter((r) => !r.replied).length} reviews
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-between">
                <span className="text-xs text-neutral-600 font-medium">Active disputes</span>
                <span className="text-sm font-bold text-neutral-900">
                  {disputes.filter((d) => d.status === "open").length} open
                </span>
              </div>
            </div>

            <div className="text-xs text-neutral-500 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Replying within 24h increases listing booking conversions by 14%
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-neutral-900">
                Guest Reviews ({reviews.length})
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Authentic traveler testimonials and your public replies
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFilter("all")}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all",
                  filter === "all"
                    ? "bg-purple text-white shadow-xs"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70",
                )}
              >
                All ({reviews.length})
              </button>
              <button
                onClick={() => setFilter("needs-reply")}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all",
                  filter === "needs-reply"
                    ? "bg-purple text-white shadow-xs"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70",
                )}
              >
                Needs Reply ({reviews.filter((r) => !r.replied).length})
              </button>
              <button
                onClick={() => setFilter("5-star")}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all",
                  filter === "5-star"
                    ? "bg-purple text-white shadow-xs"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70",
                )}
              >
                5 Stars ({reviews.filter((r) => r.rating === 5).length})
              </button>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center shadow-2xs">
                <MessageSquare className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-neutral-900">No reviews found</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Try changing the filter to see all traveler feedback.
                </p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs hover:shadow-sm transition-all duration-200 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple/10 text-purple font-bold text-xs flex items-center justify-center shrink-0 border border-purple/20">
                        {review.guestInitials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-neutral-900">
                            {review.guestName}
                          </span>
                          <span className="text-neutral-300">·</span>
                          <span className="text-xs text-purple font-semibold">
                            {review.listingName}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5">Stayed {review.date}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} />
                      <span className="text-xs font-bold text-neutral-900">{review.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-700 leading-relaxed">
                    &ldquo;{review.text}&rdquo;
                  </p>

                  {/* Reply Section */}
                  {review.replied && review.replyText ? (
                    <div className="bg-purple/[0.04] border border-purple/20 rounded-xl p-4 mt-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-purple">Your Public Response</span>
                        <CheckCircle2 className="h-3.5 w-3.5 text-purple" />
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed">
                        &ldquo;{review.replyText}&rdquo;
                      </p>
                    </div>
                  ) : replyingToId === review.id ? (
                    <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-4 mt-3 space-y-3">
                      <div className="text-xs font-bold text-neutral-800">
                        Draft response to {review.guestName}
                      </div>
                      <textarea
                        rows={3}
                        value={replyDraft}
                        onChange={(e) => setReplyDraft(e.target.value)}
                        placeholder="Thank your guest, address any observations, and let other travelers know how you care for visitors..."
                        className="w-full bg-white border border-neutral-200/80 rounded-xl p-3 text-xs text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 leading-relaxed"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setReplyingToId(null);
                            setReplyDraft("");
                          }}
                          className="px-3.5 py-1.5 rounded-xl border border-neutral-200/80 text-neutral-700 hover:bg-neutral-100 text-xs font-semibold transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSendReply(review.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-purple hover:bg-purple-hover text-white text-xs font-semibold shadow-xs transition-all"
                        >
                          <Send className="h-3 w-3" /> Post Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-xs text-neutral-400">No reply published yet</span>
                      <button
                        onClick={() => {
                          setReplyingToId(review.id);
                          setReplyDraft("");
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple hover:underline"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> Reply to this review
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Resolution & Disputes Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-neutral-900">
                Disputes & Support Cases ({disputes.length})
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Escalated incidents moderated by Nearby Escapes trust & safety team
              </p>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-2xs divide-y divide-neutral-100 overflow-hidden">
            {disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/60 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={cn(
                      "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                      dispute.status === "open"
                        ? "bg-purple/10 text-purple"
                        : "bg-emerald-50 text-emerald-700",
                    )}
                  >
                    {dispute.status === "open" ? (
                      <ShieldAlert className="h-4.5 w-4.5" />
                    ) : (
                      <ShieldCheck className="h-4.5 w-4.5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900">
                        {dispute.listingName}
                      </span>
                      <span className="text-xs font-mono text-neutral-400">#{dispute.id}</span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-0.5 max-w-xl">{dispute.issue}</p>
                    <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-2">
                      <span>Opened {dispute.date}</span>
                      <span>·</span>
                      <span>Guest: {dispute.guestName}</span>
                      {dispute.amount > 0 && (
                        <>
                          <span>·</span>
                          <span className="font-semibold text-neutral-700">
                            Claim amount: K{dispute.amount.toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[11px] font-bold rounded-full px-2.5 py-0.5",
                      dispute.status === "open"
                        ? "bg-purple/10 text-purple border border-purple/20"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-100",
                    )}
                  >
                    {dispute.status === "open" ? (
                      <>
                        <Clock className="h-3 w-3" /> Under Review
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3 w-3" /> Resolved
                      </>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-neutral-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-purple/10 text-purple flex items-center justify-center">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">Open Support Case</h3>
              </div>
              <button
                onClick={() => setShowDisputeModal(false)}
                className="h-8 w-8 rounded-lg hover:bg-neutral-100 text-neutral-500 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDispute} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Booking Confirmation Reference *
                </label>
                <input
                  type="text"
                  required
                  value={disputeBookingId}
                  onChange={(e) => setDisputeBookingId(e.target.value)}
                  placeholder="e.g. BK-4091"
                  className="w-full h-10 rounded-xl border border-neutral-200/80 px-3.5 text-sm bg-white text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Reason for Support or Dispute *
                </label>
                <textarea
                  required
                  rows={4}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Detail the issue, guest interaction, property damage or cancellation discrepancy..."
                  className="w-full rounded-xl border border-neutral-200/80 p-3 text-xs bg-white text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingDispute}
                  className="flex-1 h-11 rounded-xl bg-purple hover:bg-purple-hover text-white text-sm font-semibold shadow-xs transition-all disabled:opacity-50"
                >
                  {isSubmittingDispute ? "Submitting..." : "Submit Case"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(false)}
                  className="h-11 px-5 rounded-xl border border-neutral-200/80 text-neutral-700 hover:bg-neutral-50 text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
