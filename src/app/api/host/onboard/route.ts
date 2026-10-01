import { NextRequest, NextResponse } from "next/server";
import { mockUserStore } from "@/lib/mock-auth";

export async function POST(req: NextRequest) {
  try {
    await mockUserStore.ensureReady();
    const body = await req.json().catch(() => ({}));

    const {
      businessName,
      operatingSince,
      province,
      town,
      businessEmail,
      businessPhone,
      pacraDocs,
      ownershipDocs,
      operationDocs,
    } = body;

    if (!businessName?.trim()) {
      return NextResponse.json(
        { message: "Business name is required." },
        { status: 400 },
      );
    }

    const applicationId = `app_${Math.random().toString(36).substring(2, 9)}`;
    const submittedAt = new Date().toISOString();

    // Check if user is authenticated via cookie
    const sessionToken = req.cookies.get("ne_session")?.value || req.cookies.get("access_token")?.value;
    let userId = "usr_guest";

    if (sessionToken) {
      const activeUser = mockUserStore.findById(sessionToken);
      if (activeUser) {
        userId = activeUser.id;
        // In local mock dev mode, automatically add host role or keep in review
        const currentRoles = activeUser.roles || [activeUser.role || "guest"];
        if (!currentRoles.includes("host")) {
          currentRoles.push("host");
        }
        mockUserStore.save({
          ...activeUser,
          role: "host",
          roles: currentRoles,
          isHostVerified: true,
          name: businessName.trim() || activeUser.name,
        });
      }
    }

    return NextResponse.json(
      {
        applicationId,
        userId,
        businessName: businessName.trim(),
        status: "pending_review",
        submittedAt,
        message:
          "Application submitted. Our verification team will review your documents within 1–3 business days.",
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[api/host/onboard] Error:", err);
    return NextResponse.json(
      { message: "Failed to submit host application. Please try again." },
      { status: 500 },
    );
  }
}
