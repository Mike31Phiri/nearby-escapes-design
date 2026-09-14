 /**
 * Double-blind review system:
 * Reviews remain HIDDEN until BOTH parties have submitted their review,
 * or 14 days have elapsed since checkout — whichever comes first.
 * Only then are they PUBLISHED and visible to both parties.
 */
export type ReviewStatus = "HIDDEN" | "PUBLISHED";

export type ReviewAuthorRole = "guest" | "host";

// Review — a single review submitted by a guest or host after a booking
export interface Review {
  id: string;
  bookingId: string;
  listingId: string;
  authorId: string;
  authorRole: ReviewAuthorRole;
  authorName: string;
  authorAvatarUrl?: string;
  /** Integer 1–5 inclusive */
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  status: ReviewStatus;
  /** ISO 8601 datetime when the author submitted the review */
  submittedAt: string;
  /** ISO 8601 datetime when the review was made public; undefined if still HIDDEN */
  publishedAt?: string;
  /** Optional public reply from the host (only relevant on guest-authored reviews) */
  hostReply?: {
    body: string;
    repliedAt: string;
  };
}

// ReviewSummary — aggregated stats displayed on a listing card / detail page
export interface ReviewSummary {
  listingId: string;
  averageRating: number;
  totalReviews: number;
  /** Count of reviews at each star level */
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}
