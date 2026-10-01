import { NextRequest, NextResponse } from "next/server";
import { mockUserStore } from "@/lib/mock-auth";

export async function GET(req: NextRequest) {
  try {
    await mockUserStore.ensureReady();
    const sessionToken = req.cookies.get("ne_session")?.value || req.cookies.get("access_token")?.value;
    let businessName = "Nearby Escapes Host Partner";

    if (sessionToken) {
      const activeUser = mockUserStore.findById(sessionToken);
      if (activeUser) {
        businessName = activeUser.name;
      }
    }

    return NextResponse.json({
      applicationId: "app_44910",
      status: "pending_review",
      businessName,
      submittedAt: new Date().toISOString(),
      reviewerNotes: null,
    });
  } catch (err) {
    console.error("[api/host/application-status] Error:", err);
    return NextResponse.json(
      { message: "Failed to fetch application status." },
      { status: 500 },
    );
  }
}
