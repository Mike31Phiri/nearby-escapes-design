import { NextRequest, NextResponse } from "next/server";

let mockSavedSet = new Set<string>(["stay-1", "exp-1"]);

export async function POST(req: NextRequest) {
  try {
    const { listingId } = await req.json().catch(() => ({}));
    if (!listingId) {
      return NextResponse.json({ message: "Listing ID is required." }, { status: 400 });
    }

    const wasSaved = mockSavedSet.has(listingId);
    if (wasSaved) {
      mockSavedSet.delete(listingId);
    } else {
      mockSavedSet.add(listingId);
    }

    return NextResponse.json({
      saved: !wasSaved,
      listingId,
      totalSaved: mockSavedSet.size,
    });
  } catch (err) {
    console.error("[api/saved/toggle] Error:", err);
    return NextResponse.json({ message: "Failed to toggle saved state." }, { status: 500 });
  }
}
