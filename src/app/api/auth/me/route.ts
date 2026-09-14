import { NextRequest, NextResponse } from "next/server";
import { mockUserStore, verifySession } from "@/lib/mock-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("ne_session")?.value;
  if (!token) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const userId = await verifySession(token);
  if (!userId) {
    return NextResponse.json({ message: "Invalid or expired session." }, { status: 401 });
  }

  const record = mockUserStore.findById(userId);
  if (!record) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  const { passwordHash: _, ...user } = record;
  return NextResponse.json({ user }, { status: 200 });
}
