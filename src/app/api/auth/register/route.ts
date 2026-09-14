import { NextRequest, NextResponse } from "next/server";
import { mockUserStore, createMockUser, signSession } from "@/lib/mock-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required." },
        { status: 400 },
      );
    }

    // Check duplicate email
    const existing = mockUserStore.findByEmail(email);
    if (existing) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const user = await createMockUser({ name, email, password, phone, role: role ?? "guest" });
    mockUserStore.save(user);

    const token = await signSession(user.id);
    const res = NextResponse.json(
      { user, message: "Account created successfully." },
      { status: 201 },
    );
    res.cookies.set("ne_session", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch (e) {
    return NextResponse.json(
      { message: "Registration failed. Please try again." },
      { status: 500 },
    );
  }
}
