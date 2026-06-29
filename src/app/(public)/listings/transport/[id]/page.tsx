import { notFound } from "next/navigation";
import { mockTransport } from "@/lib/mock-data";
import { TransportDetailPage } from "@/components/guest/listings/TransportDetailPage";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string>>;
}

export async function generateStaticParams() {
  return mockTransport.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const route = mockTransport.find((t) => t.id === id);
  if (!route) return { title: "Route not found" };
  return {
    title: `${route.from} to ${route.to} Transport — Nearby Escapes`,
    description: `Book travel from ${route.from} to ${route.to} with ${route.operator}. Comfort and reliability across Zambia.`,
  };
}

export default async function TransportPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const route = mockTransport.find((t) => t.id === id);

  if (!route) notFound();

  // Reconstruct backHref from search params if present
  const backParams = new URLSearchParams({ category: "transport", ...sp });
  backParams.delete("_next");
  const backHref = `/search?${backParams.toString()}`;

  return <TransportDetailPage route={route} backHref={backHref} />;
}
