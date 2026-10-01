import { notFound } from "next/navigation";
import { mockStays } from "@/lib/mock-data";
import { StayDetailPage } from "@/components/guest/listings/StayDetailPage";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string>>;
}

export async function generateStaticParams() {
  return mockStays.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const stay = mockStays.find((s) => s.id === id || s.id === id.replace(/^s/, ""));
  if (!stay) return { title: "Stay not found" };
  return {
    title: `${stay.name} — Nearby Escapes`,
    description: `Book ${stay.name} in ${stay.location}, Zambia. ${stay.description?.slice(0, 120) ?? ""}`,
  };
}

export default async function StayRoutePage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const stay = mockStays.find((s) => s.id === id || s.id === id.replace(/^s/, ""));

  if (!stay) notFound();

  // Reconstruct backHref from search params if present
  const backParams = new URLSearchParams({ category: "stays", ...sp });
  backParams.delete("_next");
  const backHref = `/stays?${backParams.toString()}`;

  return <StayDetailPage stay={stay as any} backHref={backHref} />;
}
