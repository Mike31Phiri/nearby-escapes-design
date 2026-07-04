import { Suspense } from "react";
import { ReviewPage } from "@/components/guest/reviews/ReviewPage";

interface Props {
  params: Promise<{ bookingRef: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { bookingRef } = await params;
  return {
    title: `Leave a review — Nearby Escapes`,
    description: `Share your experience and help other guests make informed choices. Booking ref: ${bookingRef}`,
  };
}

export default async function ReviewRoute({ params }: Props) {
  const { bookingRef } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1f1433] border-t-transparent" />
        </div>
      }
    >
      <ReviewPage bookingRef={decodeURIComponent(bookingRef)} />
    </Suspense>
  );
}
