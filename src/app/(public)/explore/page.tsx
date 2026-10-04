import { Suspense } from "react";
import { ExplorePage } from "@/components/guest/explore/ExplorePage";
import { SearchListingSkeleton } from "@/components/shared/SearchListingSkeleton";

export default function ExploreIndexRoute() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 md:px-8 py-8"><SearchListingSkeleton count={8} /></div>}>
      <ExplorePage slug={[]} />
    </Suspense>
  );
}
