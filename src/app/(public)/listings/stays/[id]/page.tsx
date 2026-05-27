import { notFound } from "next/navigation";
import { mockStays } from "@/lib/mock-data";
import { StayDetailPage } from "@/views/listings/StayDetailPage";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string>>;
}

export async function generateStaticParams() {
  return mockStays.map((stay) => ({ id: stay.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const stay = mockStays.find((s) => s.id === id);
  if (!stay) return { title: "Stay not found" };
  return {
    title: `${stay.name} — Nearby Escapes`,
    description: stay.description ?? `Book ${stay.name} in ${stay.location}, Zambia.`,
  };
}

export default async function StayPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const stay = mockStays.find((s) => s.id === id);

  if (!stay) notFound();

  // Reconstruct backHref from search params if present
  const backParams = new URLSearchParams({ category: "stays", ...sp });
  backParams.delete("_next"); // strip any internals
  const backHref = `/search?${backParams.toString()}`;

  return <StayDetailPage stay={stay} backHref={backHref} />;
}
