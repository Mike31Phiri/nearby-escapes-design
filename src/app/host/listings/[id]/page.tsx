import { HostListingDetailPage } from "@/components/host/HostListingDetailPage";
import { mockHostProfile } from "@/lib/mock-profile-data";
import { notFound } from "next/navigation";

export default async function HostListingDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = mockHostProfile.listings.find((l) => l.id === id);
  if (!listing) return notFound();
  return <HostListingDetailPage listing={listing} />;
}
