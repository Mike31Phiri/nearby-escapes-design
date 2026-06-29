import { notFound } from "next/navigation";
import { getTransport } from "@/lib/api/transport";
import { TransportDetailPage } from "@/components/guest/transport/TransportDetailPage";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string>>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const transport = await getTransport(slug);
    if (!transport) return { title: "Transport not found" };
    return {
      title: `${transport.title || (transport as any).name} — Nearby Escapes`,
      description: transport.description,
    };
  } catch (error) {
    return { title: "Transport not found" };
  }
}

export default async function TransportRoute({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  let transport = null;
  try {
    transport = await getTransport(slug);
  } catch (error) {
    console.error("Failed to fetch transport:", error);
  }

  if (!transport) notFound();

  const backParams = new URLSearchParams({ ...sp });
  backParams.delete("_next");
  const backHref = `/transport?${backParams.toString()}`;

  return <TransportDetailPage transport={transport as any} backHref={backHref} />;
}
