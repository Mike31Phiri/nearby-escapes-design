import { Suspense } from "react";
import { DailyManifestPage } from "@/components/host/bookings/DailyManifestPage";

export default function ManifestRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf9f5] animate-pulse">
          <div className="mx-auto max-w-2xl px-4 pt-5 space-y-4">
            <div className="h-14 bg-neutral-200/70 rounded-xl" />
            <div className="h-28 bg-neutral-200/70 rounded-2xl" />
            <div className="h-12 bg-neutral-200/70 rounded-2xl" />
          </div>
        </div>
      }
    >
      <DailyManifestPage />
    </Suspense>
  );
}
