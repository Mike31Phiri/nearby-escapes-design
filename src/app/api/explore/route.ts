import { NextResponse } from "next/server";
import { provinces } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

/**
 * GET /api/explore — all provinces (top-level Explore grid).
 *
 * Province → city → attraction lookups happen server-side on the scoped
 * endpoint GET /api/explore/:provinceId (see that route). The client never
 * receives the full hierarchy.
 */
export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({ provinces });
}
