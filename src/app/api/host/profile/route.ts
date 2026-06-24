import { NextResponse } from "next/server";
import { mockHostProfile } from "@/lib/mock-profile-data";

export const dynamic = "force-dynamic";

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({
    name: mockHostProfile.name,
    firstName: mockHostProfile.name.split(" ")[0],
    avatarInitials: mockHostProfile.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase(),
  });
}
