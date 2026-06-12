interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
}

interface ReviewSectionProps {
  listingId: string;
  listingName?: string;
  listingType?: string;
  reviews?: Review[];
}

export function ReviewSection({ listingId, listingName, listingType, reviews = [] }: ReviewSectionProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{review.author}</span>
                <span className="text-sm text-muted-foreground">{review.date}</span>
              </div>
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-muted-foreground">{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
