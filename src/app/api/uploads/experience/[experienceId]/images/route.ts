import { NextRequest, NextResponse } from "next/server";
import { mockUserStore, verifySession } from "@/lib/mock-auth";
import { uploadToS3, uploadConfig } from "@/lib/upload";

// POST /api/uploads/experience/:experienceId/images - Upload experience images
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ experienceId: string }> },
) {
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
        { error: "Unauthorized: Only hosts can upload experience images" },
        { status: 403 },
      );
    }

    const { experienceId } = await params;

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 },
      );
    }

    const uploadedImages = [];
    const config = uploadConfig.images;

    for (const file of files) {
      if (!config.allowedTypes.includes(file.type)) {
        return NextResponse.json(
          {
            error: `Invalid file type for file ${file.name}. Allowed types: ${config.allowedTypes.join(", ")}`,
          },
          { status: 400 },
        );
      }

      if (file.size > config.maxSize) {
        return NextResponse.json(
          {
            error: `File size too large for file ${file.name}. Maximum size is ${config.maxSize / (1024 * 1024)}MB`,
          },
          { status: 400 },
        );
      }

      const result = await uploadToS3(file, `experiences/${experienceId}`);

      const id = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      uploadedImages.push({
        id,
        experienceId,
        url: result.url,
        altText: null,
        sortOrder: uploadedImages.length,
      });
    }

    return NextResponse.json({
      experienceId,
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Experience images upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload experience images" },
      { status: 500 },
    );
  }
}

// DELETE /api/uploads/experience/:experienceId/images?url=... - Delete experience image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ experienceId: string }> },
) {
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
        { error: "Unauthorized: Only hosts can delete experience images" },
        { status: 403 },
      );
    }

    const { experienceId } = await params;
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL parameter is required" },
        { status: 400 },
      );
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error("Experience image delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete experience image" },
      { status: 500 },
    );
  }
}
