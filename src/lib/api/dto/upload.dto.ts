export interface UploadAvatarResponse {
  url: string;
  key: string;
}

export interface UploadedFile {
  url: string;
  originalName: string;
}

export interface UploadResponse {
  uploaded: UploadedFile[];
}

export interface UploadedImage {
  id: string;
  [key: string]: string | number | null; // stayId, experienceId, or transportId
  url: string;
  altText: string | null;
  sortOrder: number;
}

export interface StayImagesResponse {
  stayId: string;
  images: UploadedImage[];
}

export interface ExperienceImagesResponse {
  experienceId: string;
  images: UploadedImage[];
}

export interface TransportImagesResponse {
  transportId: string;
  images: UploadedImage[];
}

export interface DeleteImageResponse {
  deleted: string;
}

export interface RemainingImagesResponse {
  id: string;
  [key: string]: string | number | null; // stayId, experienceId, or transportId
  url: string;
  altText: string | null;
  sortOrder: number;
}
