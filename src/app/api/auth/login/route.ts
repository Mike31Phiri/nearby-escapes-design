import { NextRequest, NextResponse } from "next/server";
import { mockUserStore, signSession, verifyPassword } from "@/lib/mock-auth";

export async function POST(req: NextRequest) {
  try {
    await mockUserStore.ensureReady();
    const body = await req.json().catch(() => ({}));
    const { email, password, phone } = body;

    const identifier = (email || phone || "").trim();
    if (!identifier || !password) {
      return NextResponse.json(
        { message: "Email (or phone) and password are required." },
        { status: 400 },
      );
    }

    // Try finding by email, then phone
    let record = mockUserStore.findByEmail(identifier);
    if (!record && phone) {
      record = mockUserStore.findByPhone(phone.trim());
    }

    if (!record || !(await verifyPassword(password, record.passwordHash))) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 },
      );
    }

    const { passwordHash: _, ...user } = record;
    const token = await signSession(user.id);

    const res = NextResponse.json(
      {
        user,
        accessToken: token,
        refreshToken: token,
        message: "Login successful.",
      },
      { status: 200 },
    );

    // Set HttpOnly session cookie
    res.cookies.set("ne_session", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    console.error("[api/auth/login] Error:", err);
    return NextResponse.json(
      { message: "Login failed. Please try again." },
      { status: 500 },
    );
  }
}
