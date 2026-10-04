import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  resolveLocationSlug,
  getAllLocationSlugs,
  buildStaysHeadline,
} from "@/lib/utils/locationSlug";
import { StaysPage } from "@/components/guest/stays/StaysPage";
import { SearchListingSkeleton } from "@/components/shared/SearchListingSkeleton";

interface Props {
  params: Promise<{ location: string }>;
}

export async function generateStaticParams() {
  return getAllLocationSlugs().map((slug) => ({ location: slug }));
}

export async function generateMetadata({ params }: Props) {
  const { location } = await params;
  const resolved = resolveLocationSlug(location);
  if (!resolved) return { title: "Stays — Nearby Escapes" };
  const headline = buildStaysHeadline(resolved);
  return {
    title: `${headline} — Nearby Escapes`,
    description: `Browse handpicked lodges, camps, and guesthouses. ${headline} on Nearby Escapes.`,
  };
}

export default async function LocationStaysRoute({ params }: Props) {
  const { location } = await params;
  const resolved = resolveLocationSlug(location);

  if (!resolved) notFound();

  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 md:px-8 py-8"><SearchListingSkeleton count={8} /></div>}>
      <StaysPage location={resolved} />
    </Suspense>
  );
}
