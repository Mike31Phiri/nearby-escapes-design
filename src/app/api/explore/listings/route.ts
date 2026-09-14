import { NextResponse } from "next/server";
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
 * Filtering is server-side; the client receives ready-to-render arrays.
 */
export async function GET(request: Request) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { searchParams } = new URL(request.url);
  const provinceId = searchParams.get("province") ?? undefined;
  const cityId = searchParams.get("city") ?? undefined;

  return NextResponse.json({
    stays: filterStaysByLocation(mockStays, provinceId, cityId),
    experiences: filterExperiencesByLocation(mockExperiences, provinceId, cityId),
    transport: filterTransportByLocation(mockTransport, provinceId, cityId),
  });
}
