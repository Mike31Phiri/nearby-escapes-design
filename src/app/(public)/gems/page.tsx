import { Suspense } from "react";
import { GemsPage } from "@/components/guest/gems/GemsPage";
import { SearchListingSkeleton } from "@/components/shared/SearchListingSkeleton";

export default function GemsRoute() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 md:px-8 py-8"><SearchListingSkeleton count={8} /></div>}>
      <GemsPage />
    </Suspense>
  );
}
