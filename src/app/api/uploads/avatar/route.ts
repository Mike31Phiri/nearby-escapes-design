import { NextRequest, NextResponse } from "next/server";
import { mockUserStore, verifySession } from "@/lib/mock-auth";
import { uploadToS3 } from "@/lib/upload";

// POST /api/uploads/avatar - Upload avatar image
export async function POST(request: NextRequest) {
  try {
    await mockUserStore.ensureReady();

    let token = request.cookies.get("ne_session")?.value;
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7).trim();
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const userId = await verifySession(token);
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired session." },
        { status: 401 },
      );
    }

    const record = mockUserStore.findById(userId);
    if (!record || record.role !== "host") {
      return NextResponse.json(
        { error: "Unauthorized: Only hosts can upload custom avatars" },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No avatar file provided" },
        { status: 400 },
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and GIF are allowed" },
        { status: 400 },
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB" },
        { status: 400 },
      );
    }

    const result = await uploadToS3(file, "avatars");

    return NextResponse.json({
      url: result.url,
      key: result.key,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload avatar" },
      { status: 500 },
    );
  }
}
