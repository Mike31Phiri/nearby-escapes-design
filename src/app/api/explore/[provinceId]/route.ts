import { NextResponse } from "next/server";
import {
  getExploreProvince,
  getExploreCities,
  getExploreAttractions,
  getExploreAttractionsByProvince,
} from "@/lib/mock-data";

export const dynamic = "force-dynamic";

/**
 * GET /api/explore/:provinceId?city=:cityId
 *
 * Returns the requested province with its cities and attractions. All
 * location lookups are resolved server-side — the client only receives what
 * it asked for.
 *
 * - Without `city`:      { province, cities, attractions }      (province level)
 * - With a valid `city`: { province, cities, city, attractions } (city level,
 *                        attractions scoped to that city)
 *
 * An unknown `city` is not an error: the payload degrades to the province
 * level so category-style slugs (e.g. /stays from the hub tabs) still render.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ provinceId: string }> },
) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { provinceId } = await params;
  const province = getExploreProvince(provinceId);
  if (!province) {
    return NextResponse.json({ error: "Province not found" }, { status: 404 });
  }

  const cities = getExploreCities(provinceId);

  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get("city") ?? undefined;

  const city = cityId ? cities.find((c) => c.id === cityId) : undefined;
  if (city) {
    return NextResponse.json({
      province,
      cities,
      city,
      attractions: getExploreAttractions(city.id),
    });
  }

  return NextResponse.json({
    province,
    cities,
    attractions: getExploreAttractionsByProvince(provinceId),
  });
}
