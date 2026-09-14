"use client";

import { useState } from "react";
import { Star, PlusCircle, X, ThumbsUp, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  authorLocation?: string;
  avatar?: string;
}

interface ReviewSectionProps {
  listingId: string;
  listingName?: string;
  listingType?: string;
  reviews?: ReviewItem[];
  avgRating?: number;
  reviewCount?: number;
  onViewAllReviews?: () => void;
}

export function ReviewSection({
  listingId,
  listingName = "this stay",
  listingType = "Stay",
  reviews: initialReviews = [],
  avgRating = 4.8,
  reviewCount = 0,
  onViewAllReviews,
}: ReviewSectionProps) {
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(() => {
    if (initialReviews.length > 0) return initialReviews;
    return [
      {
        id: "rev-default-1",
        author: "Sarah & James Mitchell",
        authorLocation: "Cape Town, SA",
        rating: 5,
        content:
          "Absolutely magical experience from sunrise safari walks to dinner by the river. The team was exceptionally welcoming, the food was first-class, and the views cannot be beaten.",
        date: "2 weeks ago",
      },
      {
        id: "rev-default-2",
        author: "Samuel Ngoma",
        authorLocation: "Lusaka, Zambia",
        rating: 5,
        content:
          "Such a peaceful weekend getaway! Booking through Nearby Escapes was seamless, our chalet was spotless, and the plunge pool was an absolute highlight.",
        date: "1 month ago",
      },
      {
        id: "rev-default-3",
        author: "Emma Peterson",
        authorLocation: "Melbourne, Australia",
        rating: 4.8,
        content:
          "Exceeded every expectation. The guided walking safari gave us unforgettable close encounters with wildlife, and falling asleep to the sound of the Zambezi is unforgettable.",
        date: "2 months ago",
      },
    ];
  });

  const [activeFilter, setActiveFilter] = useState<"all" | "5" | "4">("all");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});

  // Write Review Modal State
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState("");

  const handleToggleHelpful = (id: string) => {
    if (userVoted[id]) {
      toast.info("You already marked this review as helpful");
      return;
    }
    setHelpfulVotes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setUserVoted((prev) => ({ ...prev, [id]: true }));
    toast.success("Thank you for your feedback!");
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newContent.trim()) {
      toast.error("Please enter your name and a short review");
      return;
    }

    const created: ReviewItem = {
      id: `rev-user-${Date.now()}`,
      author: newAuthor.trim(),
      authorLocation: newLocation.trim() || "Verified Explorer",
      rating: newRating,
      content: newContent.trim(),
      date: "Just now",
    };

    setReviewsList([created, ...reviewsList]);
    setShowWriteModal(false);
    setNewAuthor("");
    setNewLocation("");
    setNewRating(5);
    setNewContent("");
    toast.success("Review published successfully! Thank you for sharing your experience.");
  };

  const filteredReviews = reviewsList.filter((r) => {
    if (activeFilter === "5") return r.rating >= 4.9;
    if (activeFilter === "4") return r.rating >= 4.0;
    return true;
  });

  const totalDisplayReviews = reviewsList.length || reviewCount;

  return (
    <section className="space-y-6 pt-8 border-t border-neutral-200">
      {/* Top Rating Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">
              {avgRating.toFixed(1)}
            </h2>
            <span className="text-neutral-400">·</span>
            <span className="text-sm font-normal text-neutral-600">
              {totalDisplayReviews} reviews
            </span>
          </div>
          <p className="text-xs font-normal text-neutral-500 mt-1">
            Verified ratings from travelers who booked this stay
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWriteModal(true)}
            className="px-3.5 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Write review
          </button>
          {onViewAllReviews && (
            <button
              onClick={onViewAllReviews}
              className="px-3.5 py-1.5 border border-neutral-300 hover:border-neutral-400 text-neutral-700 rounded-lg text-xs font-medium transition-colors"
            >
              See all
            </button>
          )}
        </div>
      </div>

      {/* Category Rating Breakdown Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-neutral-100">
        <div>
          <div className="flex justify-between text-xs text-neutral-600 mb-1.5">
            <span className="font-normal">Cleanliness</span>
            <span className="font-medium text-neutral-900">4.9</span>
          </div>
          <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-neutral-800 rounded-full w-[98%]" />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-neutral-600 mb-1.5">
            <span className="font-normal">Accuracy</span>
            <span className="font-medium text-neutral-900">4.8</span>
          </div>
          <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-neutral-800 rounded-full w-[96%]" />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-neutral-600 mb-1.5">
            <span className="font-normal">Communication</span>
            <span className="font-medium text-neutral-900">4.9</span>
          </div>
          <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-neutral-800 rounded-full w-[98%]" />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-neutral-600 mb-1.5">
            <span className="font-normal">Location</span>
            <span className="font-medium text-neutral-900">4.8</span>
          </div>
          <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-neutral-800 rounded-full w-[96%]" />
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => setActiveFilter("all")}
          className={cn(
            "px-3 py-1 rounded-full font-medium transition-colors",
            activeFilter === "all"
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
          )}
        >
          All ({reviewsList.length})
        </button>
        <button
          onClick={() => setActiveFilter("5")}
          className={cn(
            "px-3 py-1 rounded-full font-medium transition-colors inline-flex items-center gap-1",
            activeFilter === "5"
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
          )}
        >
          <Star className="h-3 w-3 fill-current" /> 5 Stars
        </button>
        <button
          onClick={() => setActiveFilter("4")}
          className={cn(
            "px-3 py-1 rounded-full font-medium transition-colors",
            activeFilter === "4"
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
          )}
        >
          4+ Stars
        </button>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredReviews.slice(0, 4).map((review) => (
          <div
            key={review.id}
            className="p-4 rounded-xl border border-neutral-200 bg-white space-y-2.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center font-medium text-xs shrink-0">
                  {review.author
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm text-neutral-900">{review.author}</span>
                    <ShieldCheck className="h-3 w-3 text-neutral-400" />
                  </div>
                  <p className="text-[11px] font-normal text-neutral-400">
                    {review.authorLocation && `${review.authorLocation} · `}
                    {review.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-0.5 text-xs font-medium text-neutral-700">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{review.rating.toFixed(1)}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 font-normal leading-relaxed line-clamp-4">
              &quot;{review.content}&quot;
            </p>

            <div className="flex items-center justify-end pt-1">
              <button
                onClick={() => handleToggleHelpful(review.id)}
                className={cn(
                  "inline-flex items-center gap-1 text-[11px] font-normal transition-colors px-1.5 py-0.5 rounded",
                  userVoted[review.id]
                    ? "text-purple font-medium"
                    : "text-neutral-400 hover:text-neutral-700",
                )}
              >
                <ThumbsUp className="h-3 w-3" />
                Helpful {helpfulVotes[review.id] ? `(${helpfulVotes[review.id]})` : ""}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Write Review Modal */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple" />
                <h3 className="font-semibold text-neutral-900 text-sm">Write a Guest Review</h3>
              </div>
              <button
                onClick={() => setShowWriteModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Overall Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewRating(s)}
                      className="p-0.5 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={cn(
                          "h-5 w-5 transition-colors",
                          s <= newRating ? "fill-amber-400 text-amber-400" : "text-neutral-200",
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-normal text-neutral-500 ml-2">
                    {newRating}/5 rating
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Mike Phiri"
                    className="w-full bg-neutral-50 rounded-lg p-2 border border-neutral-200 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Lusaka, Zambia"
                    className="w-full bg-neutral-50 rounded-lg p-2 border border-neutral-200 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Your Review *</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share details of your stay, the hosts, the rooms, or things future travelers should know..."
                  className="w-full bg-neutral-50 rounded-lg p-2 border border-neutral-200 text-xs font-normal leading-relaxed focus:outline-none focus:ring-1 focus:ring-neutral-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowWriteModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100 font-medium text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 font-medium text-xs"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
