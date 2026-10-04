import { Suspense } from "react";
import { ExplorePage } from "@/components/guest/explore/ExplorePage";
import { SearchListingSkeleton } from "@/components/shared/SearchListingSkeleton";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export default async function ExploreSlugRoute({ params }: Props) {
  const { slug } = await params;
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 md:px-8 py-8"><SearchListingSkeleton count={8} /></div>}>
      <ExplorePage slug={slug ?? []} />
    </Suspense>
  );
}
