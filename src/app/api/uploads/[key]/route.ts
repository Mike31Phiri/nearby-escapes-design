import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteFromS3 } from "@/lib/upload";

// DELETE /api/uploads/:key - Delete file by S3 key
export async function DELETE(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only hosts and admins can delete files by key
    // In a real implementation, we might have more granular permissions
    if (!session || (session.user.role !== "host" && session.user.role !== "admin")) {
      return NextResponse.json(
        { error: "Unauthorized: Only hosts and admins can delete files by key" },
        { status: 403 }
      );
    }

    const { key } = params;
    
    if (!key) {
      return NextResponse.json(
        { error: "Key parameter is required" },
        { status: 400 }
      );
    }

    // In a real implementation, we would verify that the user has permission to delete this file
    // For now, we'll allow hosts and admins to delete any file (not ideal for production)

    // Delete from S3
    const result = await deleteFromS3(key);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("File delete by key error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
