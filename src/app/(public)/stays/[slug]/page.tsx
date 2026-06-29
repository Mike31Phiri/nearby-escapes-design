import { notFound } from "next/navigation";
import { getStay } from "@/lib/api/stays";
import { StayDetailPage } from "@/components/guest/listings/StayDetailPage";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string>>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const stay = await getStay(slug);
    if (!stay) return { title: "Stay not found" };
    return {
      title: `${stay.title} — Nearby Escapes`,
      description: stay.description ?? `Book ${stay.title} in ${stay.location}, Zambia.`,
    };
  } catch (error) {
    return { title: "Stay not found" };
  }
}

export default async function StayPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  let stay = null;
  try {
    stay = await getStay(slug);
  } catch (error) {
    console.error("Failed to fetch stay:", error);
  }

  if (!stay) notFound();

  // Reconstruct backHref from search params if present
  const backParams = new URLSearchParams({ category: "stays", ...sp });
  backParams.delete("_next"); // strip any internals
  const backHref = `/stays?${backParams.toString()}`;

  return <StayDetailPage stay={stay as any} backHref={backHref} />;
}
