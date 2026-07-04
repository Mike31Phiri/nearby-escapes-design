"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { HostPageHeader } from "@/components/layout/HostPageHeader";
import { mockHostReviews, mockDisputes } from "@/lib/mock-host-inbox";
import type { HostReview, Dispute } from "@/lib/mock-host-inbox";
import { toast } from "sonner";

function StarIcons({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`h-3 w-3 ${s <= rating ? "text-[#2a1b47]" : "text-[#E0DBD0]"}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review, onReply }: { review: HostReview; onReply: (id: string) => void }) {
  return (
    <div className="flex gap-2.5 px-3.5 py-3 border-b border-[#E0DBD0] last:border-b-0">
      <div className="w-[30px] h-[30px] rounded-full bg-[#2A3A4A] text-[#7AAAD4] flex items-center justify-center text-[11px] font-medium shrink-0">
        {review.guestInitials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <div className="text-[12px] font-medium text-[#1C1030]">{review.guestName}</div>
          <div className="text-[10px] text-[#64748B]">
            {new Date(review.date).toLocaleDateString("en-ZM", { month: "short", year: "numeric" })}
          </div>
        </div>
        <StarIcons rating={review.rating} />
        <div className="text-[11px] text-[#64748B] leading-relaxed mt-0.5">
          &ldquo;{review.text}&rdquo;
        </div>
        {review.replied && review.replyText ? (
          <div className="mt-1.5 bg-[#EDE8F5] rounded-lg p-2">
            <div className="text-[10px] font-medium text-[#3D2463] mb-0.5">Your reply</div>
            <div className="text-[11px] text-[#5A4A70] leading-relaxed">
              &ldquo;{review.replyText}&rdquo;
            </div>
          </div>
        ) : (
          <div
            className="text-[11px] text-[#3D2463] font-medium mt-1 cursor-pointer"
            onClick={() => onReply(review.id)}
          >
            Reply to this review
          </div>
        )}
      </div>
    </div>
  );
}

function DisputeRow({ dispute }: { dispute: Dispute }) {
  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-[#E0DBD0] last:border-b-0">
      <div
        className={`w-2 h-2 rounded-full shrink-0 ${dispute.status === "open" ? "bg-[#C9703A]" : "bg-[#2A7A3A]"}`}
      ></div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-medium text-[#1C1030]">
          Booking #{dispute.id} — {dispute.issue.split(" ").slice(0, 4).join(" ")}...
        </div>
        <div className="text-[10px] text-[#64748B]">
          Raised{" "}
          {new Date(dispute.date).toLocaleDateString("en-ZM", { day: "numeric", month: "short" })} ·
          Awaiting admin response
        </div>
      </div>
      <div
        className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
          dispute.status === "open" ? "bg-[#FFF4DC] text-[#8A5C0A]" : "bg-[#E6F4EE] text-[#2A5C3F]"
        }`}
      >
        {dispute.status === "open" ? "Open" : "Resolved"}
      </div>
    </div>
  );
}

export function HostReviewsPage() {
  const [reviews] = useState<HostReview[]>(mockHostReviews);
  const [disputes] = useState<Dispute[]>(mockDisputes);
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  const handleReply = (id: string) => toast.success("Reply form opened for review");

  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <HostPageHeader
        eyebrow="Feedback"
        title="Reviews & Disputes"
        description="Monitor guest feedback and handle any resolutions."
      />
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6">
        <div className="px-4 pb-1 md:px-0">
          {/* Rating + Breakdown side by side */}
          <div className="flex gap-2 mb-3.5">
            <div className="flex-1 bg-white border border-[#E0DBD0] rounded-xl p-3 text-center">
              <div className="text-[28px] font-medium text-[#1C1030]">{avgRating.toFixed(1)}</div>
              <StarIcons rating={Math.round(avgRating)} />
              <div className="text-[11px] text-[#64748B] mt-1">{reviews.length} reviews</div>
            </div>
            <div className="flex-1 bg-white border border-[#E0DBD0] rounded-xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1 rounded-full bg-[#E8E3DC]">
                  <div className="w-[95%] h-1 rounded-full bg-[#d4b065]"></div>
                </div>
                <span className="text-[10px] text-[#64748B] w-[20px]">Loc</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1 rounded-full bg-[#E8E3DC]">
                  <div className="w-[90%] h-1 rounded-full bg-[#d4b065]"></div>
                </div>
                <span className="text-[10px] text-[#64748B] w-[20px]">Clean</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1 rounded-full bg-[#E8E3DC]">
                  <div className="w-[98%] h-1 rounded-full bg-[#d4b065]"></div>
                </div>
                <span className="text-[10px] text-[#64748B] w-[20px]">Value</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1 rounded-full bg-[#E8E3DC]">
                  <div className="w-full h-1 rounded-full bg-[#d4b065]"></div>
                </div>
                <span className="text-[10px] text-[#64748B] w-[20px]">Host</span>
              </div>
            </div>
          </div>

          {/* Recent reviews */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-medium text-[#1C1030]">Recent reviews</span>
            <span className="text-[11px] text-[#2a1b47] font-medium cursor-pointer">View all</span>
          </div>
          <div className="bg-white border border-[#E0DBD0] rounded-xl overflow-hidden mb-4">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} onReply={handleReply} />
            ))}
          </div>

          {/* Disputes */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-medium text-[#1C1030]">Disputes & support</span>
          </div>
          <div className="bg-white border border-[#E0DBD0] rounded-xl overflow-hidden">
            {disputes.map((d) => (
              <DisputeRow key={d.id} dispute={d} />
            ))}
            <div className="px-3.5 py-2.5 border-t border-[#E0DBD0]">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => toast.success("Opening new dispute form...")}
              >
                <Plus className="h-4 w-4 text-[#2a1b47]" />
                <span className="text-[12px] font-medium text-[#3D2463]">
                  Raise a new dispute or support request
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
