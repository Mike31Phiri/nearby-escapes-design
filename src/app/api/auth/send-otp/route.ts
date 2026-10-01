import { NextRequest, NextResponse } from "next/server";
import { mockOtpService, mockUserStore } from "@/lib/mock-auth";

export async function POST(req: NextRequest) {
  try {
    await mockUserStore.ensureReady();
    const body = await req.json().catch(() => ({}));
    const { phone, email } = body;

    const identifier = (phone || email || "").trim();
    if (!identifier) {
      return NextResponse.json(
        { message: "Phone number or email address is required." },
        { status: 400 },
      );
    }

    const code = mockOtpService.createOtp(identifier);

    return NextResponse.json(
      {
        success: true,
        message: `Verification code sent to ${identifier}.`,
        devOtp: code,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[api/auth/send-otp] Error:", err);
    return NextResponse.json(
      { message: "Failed to send verification code." },
      { status: 500 },
    );
  }
}
