import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToS3, uploadConfig } from "@/lib/upload";

// POST /api/uploads - General file upload
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated (GUEST, HOST, or ADMIN with INTERNAL security level)
    // For simplicity, we'll allow any authenticated user for general uploads
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Get optional query parameters
    const url = new URL(request.url);
    const propertyId = url.searchParams.get("propertyId");
    const listingId = url.searchParams.get("listingId");
    const folder = url.searchParams.get("folder") || "general";

    // Validate each file
    const uploadedFiles = [];
    const config = uploadConfig.images; // Default to image config for general uploads
    
    for (const file of files) {
      // Validate file type
      if (!config.allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { 
            error: `Invalid file type for file ${file.name}. Allowed types: ${config.allowedTypes.join(", ")}` 
          },
          { status: 400 }
        );
      }

      // Validate file size
      if (file.size > config.maxSize) {
        return NextResponse.json(
          { 
            error: `File size too large for file ${file.name}. Maximum size is ${config.maxSize / (1024 * 1024)}MB` 
          },
          { status: 400 }
        );
      }

      // Upload to S3
      const result = await uploadToS3(file, folder);
      
      uploadedFiles.push({
        url: result.url,
        originalName: file.name
      });
    }

    // In a real implementation, if propertyId or listingId was provided,
    // we would call attachPhotos backend function here
    // For now, we'll just return the uploaded files

    return NextResponse.json({
      uploaded: uploadedFiles
    });
  } catch (error) {
    console.error("General upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
