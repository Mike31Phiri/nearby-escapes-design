import { Suspense } from "react";
import { AboutPage } from "@/components/guest/about/AboutPage";

export default function AboutRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1f1433] border-t-transparent" />
        </div>
      }
    >
      <AboutPage />
    </Suspense>
  );
}

export async function generateMetadata() {
  return {
    title: "About Nearby Escapes — Our Story & Mission",
    description:
      "Nearby Escapes is a Zambian-built marketplace connecting guests with authentic local stays, experiences, and transport across Zambia. Learn our story.",
  };
}
