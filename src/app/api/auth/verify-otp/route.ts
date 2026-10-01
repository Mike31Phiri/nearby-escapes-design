import { NextRequest, NextResponse } from "next/server";
import { mockUserStore, mockOtpService, signSession } from "@/lib/mock-auth";

export async function POST(req: NextRequest) {
  try {
    await mockUserStore.ensureReady();
    const body = await req.json().catch(() => ({}));
    const { phone, email, otp } = body;

    const identifier = (phone || email || "").trim();
    const code = (otp || "").trim();

    if (!identifier || !code) {
      return NextResponse.json(
        { message: "Phone/email identifier and OTP code are required." },
        { status: 400 },
      );
    }

    const isValid = mockOtpService.verifyOtp(identifier, code);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid or expired verification code." },
        { status: 400 },
      );
    }

    // Check if user already exists
    let user = mockUserStore.findByEmail(identifier);
    if (!user && phone) {
      user = mockUserStore.findByPhone(phone.trim());
    }

    if (user) {
      const token = await signSession(user.id);
      const { passwordHash: _, ...safeUser } = user;

      const res = NextResponse.json(
        {
          success: true,
          message: "Verification successful.",
          user: safeUser,
          accessToken: token,
          refreshToken: token,
        },
        { status: 200 },
      );

      res.cookies.set("ne_session", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return res;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Code verified successfully.",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[api/auth/verify-otp] Error:", err);
    return NextResponse.json(
      { message: "Failed to verify OTP code." },
      { status: 500 },
    );
  }
}
