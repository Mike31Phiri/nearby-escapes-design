import { Suspense } from "react";
import { SearchPage } from "@/components/search/DiscoveryPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SearchPage />
    </Suspense>
  );
}
