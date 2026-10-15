import { v4 as uuidv4 } from "uuid";

/**
 * Upload utility for handling file uploads to storage (S3 simulation)
 * In production, this would use AWS SDK or similar service
 */

/**
 * Upload a file to storage
 * @param file - The file to upload
 * @param folder - The folder/category to upload to (avatars, stays, experiences, transports, etc.)
 * @returns Object with url and key
 */
export async function uploadToS3(file: File, folder: string): Promise<{
  url: string;
  key: string;
}> {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate a unique key for the file
  const fileExtension = file.name.split('.').pop() || '';
  const key = `${folder}/${uuidv4()}.${fileExtension}`;
  
  // In a real implementation, this would upload to S3 and return the actual URL
  // For simulation, we'll return a mock URL
  const url = `https://mock-s3-bucket.nyc3.digitaloceanspaces.com/${key}`;
  
  return { url, key };
}

/**
 * Delete a file from storage by key
 * @param key - The storage key of the file to delete
 * @returns Object with deleted URL
 */
export async function deleteFromS3(key: string): Promise<{ deleted: string }> {
  // Simulate delete delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real implementation, this would delete from S3
  // For simulation, we'll reconstruct the URL
  const url = `https://mock-s3-bucket.nyc3.digitaloceanspaces.com/${key}`;
  
  return { deleted: url };
}

/**
 * Get upload configuration for different file types
 */
export const uploadConfig = {
  avatars: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/gif"],
    folder: "avatars"
  },
  images: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    folder: "images"
  },
  documents: {
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    folder: "documents"
  }
};
