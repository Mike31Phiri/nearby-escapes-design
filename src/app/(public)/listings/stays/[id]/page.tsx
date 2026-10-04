import { notFound } from "next/navigation";
import { mockStays } from "@/lib/mock-data";
import { fetchStayById } from "@/lib/api/discovery";
import { StayDetailPage } from "@/components/guest/listings/StayDetailPage";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string>>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const stay = (await fetchStayById(id)) || mockStays.find((s) => s.id === id);
  if (!stay) return { title: "Stay not found" };
  return {
    title: `${stay.name} — Nearby Escapes`,
    description: `Book ${stay.name} in ${stay.location}, Zambia.`,
  };
}

export default async function ListingsStaysDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const stay = (await fetchStayById(id)) || mockStays.find((s) => s.id === id);

  if (!stay) notFound();

  const backParams = new URLSearchParams({ category: "stays", ...sp });
  backParams.delete("_next");
  const backHref = `/stays?${backParams.toString()}`;

  return <StayDetailPage stay={stay as any} backHref={backHref} />;
}
