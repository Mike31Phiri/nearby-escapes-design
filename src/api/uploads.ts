import { apiRequest } from "./client";

export type UploadResourceType = "accommodation" | "bus" | "attraction" | "package";

export type UploadResponse = {
  key: string;
  url: string;
};

export const uploadFile = (
  file: File,
  resourceType: UploadResourceType,
  resourceId: string,
) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest<UploadResponse>(
    `/uploads?resourceType=${resourceType}&resourceId=${resourceId}`,
    {
      method: "POST",
      body: formData,
      headers: {},  // let browser set Content-Type with boundary for multipart
    },
  );
};

export const deleteUpload = (key: string) =>
  apiRequest<void>(`/uploads/${key}`, { method: "DELETE" });
