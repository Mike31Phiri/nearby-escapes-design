"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createGuestReview } from "@/lib/api/reviews";

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingName?: string;
  listingType?: string;
  bookingRef?: string;
  guestName?: string;
}

export function ReviewDialog({
  isOpen,
  onClose,
  listingId,
  listingName,
  listingType,
  bookingRef,
  guestName,
}: ReviewDialogProps) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Please provide some feedback in your review.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createGuestReview({
        propertyId: listingId,
        bookingRef,
        rating,
        text: content.trim(),
      });
      toast.success("Thank you! Your review has been submitted.");
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to submit review. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg p-6 shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
        {listingName && <p className="text-base text-muted-foreground mb-4">for {listingName}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-base font-medium mb-1">Rating</label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className={`text-2xl ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-base font-medium mb-1">Your Review</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full border rounded-md p-2 text-base"
              placeholder="Share your experience..."
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-base rounded-md border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-base rounded-md bg-primary text-primary-foreground"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
