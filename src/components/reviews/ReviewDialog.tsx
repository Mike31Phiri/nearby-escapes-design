"use client";

import { useState } from "react";

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit review logic
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg p-6 shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
        {listingName && (
          <p className="text-sm text-muted-foreground mb-4">for {listingName}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className={`text-2xl ${
                    i < rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Your Review</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full border rounded-md p-2 text-sm"
              placeholder="Share your experience..."
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
