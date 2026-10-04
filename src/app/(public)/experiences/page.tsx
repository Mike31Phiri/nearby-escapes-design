import { Suspense } from "react";
import { ExperiencesPage } from "@/components/guest/experiences/ExperiencesPage";
import { SearchListingSkeleton } from "@/components/shared/SearchListingSkeleton";

export default function ExperiencesRoute() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 md:px-8 py-8"><SearchListingSkeleton count={8} /></div>}>
      <ExperiencesPage />
    </Suspense>
  );
}
