import { NextResponse } from "next/server";
import { fetchAllListings } from "@/lib/api/discovery";
import {
  mockStays,
  mockExperiences,
  mockTransport,
  filterStaysByLocation,
  filterExperiencesByLocation,
  filterTransportByLocation,
} from "@/lib/mock-data";

export const dynamic = "force-dynamic";

/**
 * GET /api/explore/listings?province=southern&city=livingstone
 *
 * Returns location-scoped stays, experiences and transport for ExploreHub.
 * Uses live backend API listings with graceful fallback.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provinceId = searchParams.get("province") ?? undefined;
  const cityId = searchParams.get("city") ?? undefined;

  try {
    const { stays, experiences, transports } = await fetchAllListings();
    if (stays.length > 0 || experiences.length > 0 || transports.length > 0) {
      return NextResponse.json({
        stays: filterStaysByLocation((stays.length > 0 ? stays : mockStays) as any, provinceId, cityId),
        experiences: filterExperiencesByLocation((experiences.length > 0 ? experiences : mockExperiences) as any, provinceId, cityId),
        transport: filterTransportByLocation((transports.length > 0 ? transports : mockTransport) as any, provinceId, cityId),
      });
    }
  } catch (err) {
    console.error("Failed to fetch live listings in explore route:", err);
  }

  return NextResponse.json({
    stays: filterStaysByLocation(mockStays, provinceId, cityId),
    experiences: filterExperiencesByLocation(mockExperiences, provinceId, cityId),
    transport: filterTransportByLocation(mockTransport, provinceId, cityId),
  });
}
