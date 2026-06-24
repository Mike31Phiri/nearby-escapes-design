import { Suspense } from "react";
import { SafetyTrustPage } from "@/components/safety/SafetyTrustPage";

export default function SafetyRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2A1B3D] border-t-transparent" />
        </div>
      }
    >
      <SafetyTrustPage />
    </Suspense>
  );
}

export async function generateMetadata() {
  return {
    title: "Safety & Trust Centre — Nearby Escapes",
    description:
      "Learn how Nearby Escapes keeps guests and hosts safe. Verified profiles, secure payments, guest protections, community guidelines, and 24/7 support.",
  };
}
