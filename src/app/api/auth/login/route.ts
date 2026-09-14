import { NextRequest, NextResponse } from "next/server";
import { mockUserStore, signSession, verifyPassword } from "@/lib/mock-auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    const record = mockUserStore.findByEmail(email);
    if (!record || !(await verifyPassword(password, record.passwordHash))) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const { passwordHash: _, ...user } = record;
    const token = await signSession(user.id);
    const res = NextResponse.json({ user }, { status: 200 });
    res.cookies.set("ne_session", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ message: "Login failed. Please try again." }, { status: 500 });
  }
}
