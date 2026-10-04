import { Suspense } from "react";
import { PackagesPage } from "@/components/guest/packages/PackagesPage";
import { SearchListingSkeleton } from "@/components/shared/SearchListingSkeleton";

export default function PackagesRoute() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 md:px-8 py-8"><SearchListingSkeleton count={8} /></div>}>
      <PackagesPage />
    </Suspense>
  );
}
