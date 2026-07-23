import { createZodDto } from 'nestjs-zod';
import { mediaPurposeSchema, entityTypeSchema, MediaPurpose, EntityType } from '@repo/schema';
import z from 'zod';

export const uploadMediaSchema = z.object({
  purpose: mediaPurposeSchema,
  entityType: entityTypeSchema,
  entityId: z.string().optional(),
  metadata: z.string().optional(),
});

export class UploadMediaDto extends createZodDto(uploadMediaSchema) {
  purpose!: MediaPurpose;
  entityType!: EntityType;
  entityId?: string;
  metadata?: string;
}
