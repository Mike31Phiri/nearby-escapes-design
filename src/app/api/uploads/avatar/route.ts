import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToS3 } from "@/lib/upload";

// POST /api/uploads/avatar - Upload avatar image
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only hosts can upload avatars, guests use default system avatar
    if (!session || session.user.role !== "host") {
      return NextResponse.json(
        { error: "Unauthorized: Only hosts can upload custom avatars" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No avatar file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and GIF are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Upload to S3
    const result = await uploadToS3(file, "avatars");
    
    return NextResponse.json({
      url: result.url,
      key: result.key
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload avatar" },
      { status: 500 }
    );
  }
}
