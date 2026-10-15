import { NextRequest, NextResponse } from "next/server";
import { mockUserStore, verifySession } from "@/lib/mock-auth";
import { deleteFromS3 } from "@/lib/upload";

// DELETE /api/uploads/:key - Delete file by S3 key
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
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
    if (!record || (record.role !== "host" && record.role !== "admin")) {
      return NextResponse.json(
        { error: "Unauthorized: Only hosts and admins can delete files by key" },
        { status: 403 },
      );
    }

    const { key } = await params;

    if (!key) {
      return NextResponse.json(
        { error: "Key parameter is required" },
        { status: 400 },
      );
    }

    const result = await deleteFromS3(key);

    return NextResponse.json(result);
  } catch (error) {
    console.error("File delete by key error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
}
