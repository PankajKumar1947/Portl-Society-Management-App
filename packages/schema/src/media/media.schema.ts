import z from "zod";

export const MEDIA_PURPOSES = [
  "NOTICE_ATTACHMENT",
  "COMPLAINT_ATTACHMENT",
  "AMENITY_GALLERY",
  "PROFILE_PICTURE",
  "USER_VERIFICATION_DOC",
  "SOCIETY_LOGO",
] as const;

export const MediaPurposes = {
  NOTICE_ATTACHMENT: "NOTICE_ATTACHMENT",
  COMPLAINT_ATTACHMENT: "COMPLAINT_ATTACHMENT",
  AMENITY_GALLERY: "AMENITY_GALLERY",
  PROFILE_PICTURE: "PROFILE_PICTURE",
  USER_VERIFICATION_DOC: "USER_VERIFICATION_DOC",
  SOCIETY_LOGO: "SOCIETY_LOGO",
} as const;

export const mediaPurposeSchema = z.enum(MEDIA_PURPOSES);

export const ENTITY_TYPES = [
  "notices",
  "complaints",
  "amenities",
  "users",
  "societies",
] as const;

export const EntityTypes = {
  NOTICES: "notices",
  COMPLAINTS: "complaints",
  AMENITIES: "amenities",
  USERS: "users",
  SOCIETIES: "societies",
} as const;

export const entityTypeSchema = z.enum(ENTITY_TYPES);

export const DOCUMENT_TYPES = [
  "AADHAR",
  "PAN",
  "DRIVING_LICENSE",
  "PASSPORT",
  "POLICE_VERIFICATION",
  "OTHER",
] as const;

export const documentTypeSchema = z.enum(DOCUMENT_TYPES);

export const VERIFICATION_STATUSES = [
  "PENDING",
  "VERIFIED",
  "REJECTED",
] as const;

export const verificationStatusSchema = z.enum(VERIFICATION_STATUSES);

export const mediaMetadataSchema = z.object({
  documentType: documentTypeSchema.optional(),
  documentNumber: z.string().optional(),
  verificationStatus: verificationStatusSchema.optional(),
  rejectionReason: z.string().optional(),
});

export const mediaSchema = z.object({
  mediaId: z.string().min(1, "Media ID is required"),
  societyId: z.string().min(1, "Society ID is required"),
  uploadedBy: z.string().min(1, "Uploader user ID is required"),
  url: z.string().url("Invalid file URL"),
  key: z.string().min(1, "Storage file key is required"),
  fileName: z.string().min(1, "Filename is required"),
  mimeType: z.string().min(1, "MIME type is required"),
  sizeBytes: z.number().int().positive("Size must be positive"),
  purpose: mediaPurposeSchema,
  entityType: entityTypeSchema,
  entityId: z.string().optional(),
  metadata: mediaMetadataSchema.optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const createMediaSchema = mediaSchema.omit({
  mediaId: true,
  createdAt: true,
  updatedAt: true,
});
