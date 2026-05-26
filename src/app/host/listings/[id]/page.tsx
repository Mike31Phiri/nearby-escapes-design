import { notFound } from "next/navigation";
import { mockHostProfile } from "@/lib/mock-profile-data";
import { HostListingDetailPage } from "@/views/host-listings/HostListingDetailPage";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return mockHostProfile.listings.map((listing) => ({ id: listing.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const listing = mockHostProfile.listings.find((l) => l.id === id);
  if (!listing) return { title: "Listing not found" };
  return {
    title: `${listing.name} — Host Dashboard | Nearby Escapes`,
    description: `Manage ${listing.name}, view analytics, and handle bookings for your ${listing.type} listing.`,
  };
}

export default async function HostListingDetailRoute({ params }: Props) {
  const { id } = await params;
  const listing = mockHostProfile.listings.find((l) => l.id === id);

  if (!listing) notFound();

  return <HostListingDetailPage listing={listing} />;
}
