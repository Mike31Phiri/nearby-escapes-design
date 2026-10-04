import { notFound } from "next/navigation";
import {
  fetchStayById,
  fetchExperienceById,
  fetchTransportById,
} from "@/lib/api/discovery";
import { mockStays, mockTransport, mockExperiences, mockGems, mockPackages } from "@/lib/mock-data";
import { BookingFormPage } from "@/components/guest/checkout/BookingFormPage";
import type { ListingData } from "@/components/guest/checkout/BookingFormPage";

export const dynamic = "force-dynamic";

export type { ListingData };

interface Props {
  searchParams: Promise<Record<string, string>>;
}

export default async function BookPage({ searchParams }: Props) {
  const sp = await searchParams;
  const type = sp.type as string;
  const id = sp.id as string;

  if (!type || !id) notFound();

  let listing: ListingData | null = null;

  if (type === "stay") {
    // Try live API first
    const liveStay = await fetchStayById(id);
    if (liveStay) {
      listing = {
        type: "stay",
        id: liveStay.id,
        name: liveStay.name,
        location: liveStay.location,
        image: liveStay.images?.[0] || liveStay.image,
        price: liveStay.price,
        rating: liveStay.rating,
        reviews: liveStay.reviews,
        guests: liveStay.guests,
        beds: liveStay.beds,
        baths: liveStay.baths,
        meetingPoint: sp.meetingPoint || liveStay.location,
      };
    } else {
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
          meetingPoint: sp.meetingPoint || stay.location,
        };
      }
    }
  } else if (type === "experience") {
    // Try live API first
    const liveExp = await fetchExperienceById(id);
    if (liveExp) {
      const expAny = liveExp as any;
      listing = {
        type: "experience",
        id: liveExp.id,
        name: expAny.title || expAny.name || "Experience",
        location: liveExp.location,
        image: expAny.images?.[0] || expAny.image || "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=70",
        price: liveExp.price,
        rating: liveExp.rating,
        reviews: expAny.reviewsCount || expAny.reviews,
        duration: liveExp.duration,
        isPackage: false,
        meetingPoint:
          sp.meetingPoint ||
          (liveExp.location
            ? `${liveExp.location}, Zambia`
            : "Lusaka Showgrounds, Great East Road"),
      };
    } else {
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
          meetingPoint:
            sp.meetingPoint ||
            ("meetingPoint" in experience && typeof experience.meetingPoint === "string"
              ? experience.meetingPoint
              : experience.location
                ? `${experience.location}, Zambia`
                : "Lusaka Showgrounds, Great East Road"),
        };
      }
    }
  } else if (type === "transport") {
    // Try live API first
    const liveTransport = await fetchTransportById(id);
    if (liveTransport) {
      const trAny = liveTransport as any;
      listing = {
        type: "transport",
        id: liveTransport.id,
        name: `${liveTransport.from} to ${liveTransport.to}`,
        location: `${liveTransport.from} → ${liveTransport.to}`,
        image: trAny.images?.[0] || trAny.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=70",
        price: liveTransport.price,
        duration: liveTransport.duration,
        from: liveTransport.from,
        to: liveTransport.to,
        operator: liveTransport.operator,
        meetingPoint: sp.meetingPoint || `${liveTransport.from} Departure Station`,
      };
    } else {
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
          meetingPoint: sp.meetingPoint || `${transport.from} Departure Station`,
        };
      }
    }
  }

  if (!listing) notFound();

  // Reconstruct backHref
  const backHref = `/${type === "stay" ? "stays" : type === "experience" ? "experiences" : "transport"}`;

  return (
    <BookingFormPage
      listing={listing}
      backHref={`/listings/${type === "stay" ? "stays" : type === "experience" ? "experiences" : "transport"}/${id}`}
    />
  );
}
