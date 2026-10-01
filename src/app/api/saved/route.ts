import { NextRequest, NextResponse } from "next/server";

// In-memory mock storage for dev testing
let mockSavedListingIds: string[] = ["stay-1", "exp-1"];

export async function GET() {
  return NextResponse.json({
    data: [
      {
        id: "sav_01",
        listingId: "1",
        vertical: "stay",
        title: "The River Club Lodge",
        city: "Livingstone",
        province: "Southern",
        featuredImage: "/images/stays/stay-1.jpg",
        pricePerUnitNgwee: 250000,
        currency: "ZMW",
        rating: 4.9,
        reviewCount: 42,
        savedAt: new Date().toISOString(),
      },
    ],
    total: 1,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { listingId } = await req.json().catch(() => ({}));
    if (!listingId) {
      return NextResponse.json({ message: "Listing ID is required." }, { status: 400 });
    }

    if (!mockSavedListingIds.includes(listingId)) {
      mockSavedListingIds.push(listingId);
    }

    return NextResponse.json(
      {
        success: true,
        savedId: `sav_${Date.now()}`,
        listingId,
        savedAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[api/saved] Error:", err);
    return NextResponse.json({ message: "Failed to save listing." }, { status: 500 });
  }
}
