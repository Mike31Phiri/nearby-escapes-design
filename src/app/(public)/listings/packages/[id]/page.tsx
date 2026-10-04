import { notFound } from "next/navigation";
import { fetchExperienceById } from "@/lib/api/discovery";
import { mockPackages } from "@/lib/mock-data";
import { PackageDetailPage } from "@/components/guest/listings/PackageDetailPage";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return mockPackages.map((pkg) => ({ id: pkg.id }));
}

export default async function ListingsPackageRoute({ params }: Props) {
  const { id } = await params;
  let packageItem: any = mockPackages.find((p) => p.id === id);

  if (!packageItem) {
    const liveExp = await fetchExperienceById(id);
    if (liveExp) {
      const expAny = liveExp as any;
      packageItem = {
        id: liveExp.id,
        name: expAny.title || expAny.name || "Package",
        location: liveExp.location,
        image: expAny.images?.[0] || expAny.image || "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=70",
        price: liveExp.price,
        rating: liveExp.rating || 5.0,
        reviews: expAny.reviewsCount || expAny.reviews || 0,
        duration: liveExp.duration || "Multi-day",
        highlights: expAny.itinerary?.map((it: any) => it.title) || expAny.inclusions || [],
        description: liveExp.description,
        gallery: expAny.images || (expAny.image ? [expAny.image] : []),
        inclusions: expAny.inclusions || [],
        exclusions: [],
        meetingPoint: liveExp.location,
        cancellationPolicy: "Flexible cancellation up to 48 hours before start.",
      };
    }
  }

  if (!packageItem) notFound();

  return <PackageDetailPage packageItem={packageItem} backHref="/packages" />;
}
