import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToS3, uploadConfig } from "@/lib/upload";

// POST /api/uploads/transport/:transportId/images - Upload transport images
export async function POST(
  request: NextRequest,
  { params }: { params: { transportId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only hosts can upload transport images
    if (!session || session.user.role !== "host") {
      return NextResponse.json(
        { error: "Unauthorized: Only hosts can upload transport images" },
        { status: 403 }
      );
    }

    const { transportId } = params;
    
    // In a real implementation, we would verify that the transport belongs to the host
    // For now, we'll assume the transportId is valid

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Validate each file
    const uploadedImages = [];
    const config = uploadConfig.images;
    
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
      const result = await uploadToS3(file, `transports/${transportId}`);
      
      // Generate a mock ID for the image
      const id = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      uploadedImages.push({
        id,
        transportId,
        url: result.url,
        altText: null, // Would be provided in a real implementation
        sortOrder: uploadedImages.length // Simple sequential ordering
      });
    }

    // In a real implementation, we would save these images to the database
    // and return the full list of images for this transport
    // For simulation, we'll just return what we just uploaded

    return NextResponse.json({
      transportId,
      images: uploadedImages
    });
  } catch (error) {
    console.error("Transport images upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload transport images" },
      { status: 500 }
    );
  }
}

// DELETE /api/uploads/transport/:transportId/images?url=... - Delete transport image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { transportId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only hosts can delete transport images
    if (!session || session.user.role !== "host") {
      return NextResponse.json(
        { error: "Unauthorized: Only hosts can delete transport images" },
        { status: 403 }
      );
    }

    const { transportId } = params;
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get("url");
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL parameter is required" },
        { status: 400 }
      );
    }

    // In a real implementation, we would:
    // 1. Find the image record by URL in the database
    // 2. Extract the S3 key from the record
    // 3. Delete the file from S3
    // 4. Remove the database record
    // 5. Return the remaining images
    
    // For simulation, we'll just return an empty array
    // indicating no remaining images (since we don't have a real DB)
    
    return NextResponse.json([]);
  } catch (error) {
    console.error("Transport image delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete transport image" },
      { status: 500 }
    );
  }
}
