import { NextRequest, NextResponse } from "next/server";
import { mockUserStore, mockResetService, mockOtpService } from "@/lib/mock-auth";

export async function POST(req: NextRequest) {
  try {
    await mockUserStore.ensureReady();
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    if (!email?.trim()) {
      return NextResponse.json(
        { message: "Email address is required." },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = mockUserStore.findByEmail(cleanEmail);

    // Create reset token & OTP
    const resetToken = mockResetService.createResetToken(cleanEmail);
    const otp = mockOtpService.createOtp(cleanEmail);

    // In production, we don't disclose whether an email exists for security,
    // but in development we provide the dev OTP and token for testing.
    return NextResponse.json(
      {
        success: true,
        message: user
          ? "Password reset instructions and verification code sent to your email."
          : "If an account with this email exists, password reset instructions have been sent.",
        resetToken,
        devOtp: otp,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[api/auth/forgot-password] Error:", err);
    return NextResponse.json(
      { message: "Failed to process forgot password request." },
      { status: 500 },
    );
  }
}
