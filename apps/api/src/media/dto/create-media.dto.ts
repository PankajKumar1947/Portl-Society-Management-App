import { createZodDto } from 'nestjs-zod';
import { createMediaSchema, MediaPurpose, EntityType, MediaMetadata } from '@repo/schema';

export class CreateMediaDto extends createZodDto(createMediaSchema) {
  societyId!: string;
  uploadedBy!: string;
  url!: string;
  key!: string;
  fileName!: string;
  mimeType!: string;
  sizeBytes!: number;
  purpose!: MediaPurpose;
  entityType!: EntityType;
  entityId?: string;
  metadata?: MediaMetadata;
}
