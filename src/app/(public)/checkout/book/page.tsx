import { notFound } from "next/navigation";
import { mockStays, mockTransport, mockExperiences, mockGems, mockPackages } from "@/lib/mock-data";
import { BookingFormPage } from "@/components/guest/checkout/BookingFormPage";
import type { ListingData } from "@/components/guest/checkout/BookingFormPage";

export type { ListingData };

interface Props {
  searchParams: Promise<Record<string, string>>;
}

export default async function BookPage({ searchParams }: Props) {
  const sp = await searchParams;
  const type = sp.type as string;
  const id = sp.id as string;

  if (!type || !id) notFound();

  // Look up the listing from mock data
  let listing: ListingData | null = null;

  if (type === "stay") {
    const stay = mockStays.find((s) => s.id === id);
    if (stay) {
      listing = {
        type: "stay",
        id: stay.id,
        name: stay.name,
        location: stay.location,
        image: stay.images?.[0] || stay.image,
        price: stay.price,
        rating: stay.rating,
        reviews: stay.reviews,
        guests: stay.guests,
        beds: stay.beds,
        baths: stay.baths,
      };
    }
  } else if (type === "experience") {
    const experience =
      mockExperiences.find((e) => e.id === id) ||
      mockGems.find((g) => g.id === id) ||
      mockPackages.find((p) => p.id === id);
    if (experience) {
      listing = {
        type: "experience",
        id: experience.id,
        name: experience.name,
        location: experience.location,
        image: experience.image,
        price: experience.price,
        rating: "rating" in experience ? experience.rating : undefined,
        reviews: "reviews" in experience ? experience.reviews : undefined,
        duration: "duration" in experience ? experience.duration : undefined,
        isPackage: experience.id.startsWith("p"),
      };
    }
  } else if (type === "transport") {
    const transport = mockTransport.find((t) => t.id === id);
    if (transport) {
      listing = {
        type: "transport",
        id: transport.id,
        name: `${transport.from} to ${transport.to}`,
        location: `${transport.from} → ${transport.to}`,
        image: transport.image,
        price: transport.price,
        duration: transport.duration,
        from: transport.from,
        to: transport.to,
        operator: transport.operator,
      };
    }
  }

  if (!listing) notFound();

  // Reconstruct backHref
  const backHref = `/search?category=${type === "stay" ? "stays" : type === "experience" ? "attractions" : "transport"}`;

  return (
    <BookingFormPage
      listing={listing}
      backHref={`/listings/${type === "stay" ? "stays" : type === "experience" ? "experiences" : "transport"}/${id}`}
    />
  );
}
