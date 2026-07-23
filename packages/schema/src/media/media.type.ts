import z from "zod";
import {
  mediaSchema,
  createMediaSchema,
  mediaPurposeSchema,
  entityTypeSchema,
  documentTypeSchema,
  verificationStatusSchema,
  mediaMetadataSchema,
} from "./media.schema";
import { ApiResponse } from "../shared/api.type";

export type MediaPurpose = z.infer<typeof mediaPurposeSchema>;
export type EntityType = z.infer<typeof entityTypeSchema>;
export type DocumentType = z.infer<typeof documentTypeSchema>;
export type VerificationStatus = z.infer<typeof verificationStatusSchema>;
export type MediaMetadata = z.infer<typeof mediaMetadataSchema>;

export type MediaData = z.infer<typeof mediaSchema>;
export type CreateMediaBody = z.infer<typeof createMediaSchema>;

export type MediaResponse = ApiResponse<MediaData>;
export type MediaListResponse = ApiResponse<MediaData[]>;
