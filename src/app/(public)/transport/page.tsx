import { Suspense } from "react";
import { TransportPage } from "@/components/guest/transport/TransportPage";
import { SearchListingSkeleton } from "@/components/shared/SearchListingSkeleton";

export default function TransportRoute() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 md:px-8 py-8"><SearchListingSkeleton count={8} /></div>}>
      <TransportPage />
    </Suspense>
  );
}
