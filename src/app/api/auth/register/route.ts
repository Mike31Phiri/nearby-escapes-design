import { NextRequest, NextResponse } from "next/server";
import { mockUserStore, createMockUser, signSession } from "@/lib/mock-auth";

export async function POST(req: NextRequest) {
  try {
    await mockUserStore.ensureReady();
    const body = await req.json().catch(() => ({}));
    const { name, email, password, phone, role } = body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { message: "Full name, email address, and password are required." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long." },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    // Check duplicate email
    const existingEmail = mockUserStore.findByEmail(cleanEmail);
    if (existingEmail) {
      return NextResponse.json(
        { message: "An account with this email address already exists. Please log in." },
        { status: 409 },
      );
    }

    // Check duplicate phone if provided
    if (phone?.trim()) {
      const existingPhone = mockUserStore.findByPhone(phone.trim());
      if (existingPhone) {
        return NextResponse.json(
          { message: "An account with this phone number already exists." },
          { status: 409 },
        );
      }
    }

    // Public registration creates a guest account. Host capabilities require /become-host onboarding.
    const assignedRole = "guest";

    const user = await createMockUser({
      name: name.trim(),
      email: cleanEmail,
      password: password.trim(),
      phone: phone?.trim(),
      role: assignedRole,
    });

    mockUserStore.save(user);

    const token = await signSession(user.id);
    const { passwordHash: _, ...safeUser } = user;

    const res = NextResponse.json(
      {
        user: safeUser,
        accessToken: token,
        refreshToken: token,
        message: "Account created successfully.",
      },
      { status: 201 },
    );

    res.cookies.set("ne_session", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    console.error("[api/auth/register] Error:", err);
    return NextResponse.json(
      { message: "Registration failed. Please try again." },
      { status: 500 },
    );
  }
}
