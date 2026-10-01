import { NextRequest, NextResponse } from "next/server";
import { mockUserStore, verifySession, signSession } from "@/lib/mock-auth";

export async function POST(req: NextRequest) {
  try {
    await mockUserStore.ensureReady();

    let token = req.cookies.get("ne_session")?.value;
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7).trim();
      }
    }

    if (!token) {
      return NextResponse.json({ message: "No active session to refresh." }, { status: 401 });
    }

    const userId = await verifySession(token);
    if (!userId) {
      return NextResponse.json({ message: "Session expired or invalid." }, { status: 401 });
    }

    const record = mockUserStore.findById(userId);
    if (!record) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const newToken = await signSession(userId);
    const { passwordHash: _, ...user } = record;

    const res = NextResponse.json(
      {
        user,
        accessToken: newToken,
        refreshToken: newToken,
        message: "Session refreshed.",
      },
      { status: 200 },
    );

    res.cookies.set("ne_session", newToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error("[api/auth/refresh] Error:", err);
    return NextResponse.json({ message: "Failed to refresh session." }, { status: 500 });
  }
}
