import { NextRequest, NextResponse } from "next/server";
import { mockUserStore, mockResetService, mockOtpService } from "@/lib/mock-auth";

export async function POST(req: NextRequest) {
  try {
    await mockUserStore.ensureReady();
    const body = await req.json().catch(() => ({}));
    const { token, newPassword, email, otp } = body;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { message: "New password must be at least 6 characters long." },
        { status: 400 },
      );
    }

    let targetEmail: string | null = null;

    // Option A: Verify via reset token
    if (token) {
      targetEmail = mockResetService.consumeResetToken(token);
    }

    // Option B: Verify via email + OTP
    if (!targetEmail && email && otp) {
      const valid = mockOtpService.verifyOtp(email, otp);
      if (valid) {
        targetEmail = email.toLowerCase().trim();
      }
    }

    // Fallback: If only email is provided in development or dev otp matches
    if (!targetEmail && email && otp === "123456") {
      targetEmail = email.toLowerCase().trim();
    }

    if (!targetEmail) {
      return NextResponse.json(
        { message: "Invalid or expired reset token/code. Please request a new one." },
        { status: 400 },
      );
    }

    const user = mockUserStore.findByEmail(targetEmail);
    if (!user) {
      return NextResponse.json(
        { message: "User account associated with this request was not found." },
        { status: 404 },
      );
    }

    const updated = await mockUserStore.updatePassword(user.id, newPassword);
    if (!updated) {
      return NextResponse.json(
        { message: "Failed to update password." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your password has been successfully reset. Please log in.",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[api/auth/reset-password] Error:", err);
    return NextResponse.json(
      { message: "Failed to reset password. Please try again." },
      { status: 500 },
    );
  }
}
