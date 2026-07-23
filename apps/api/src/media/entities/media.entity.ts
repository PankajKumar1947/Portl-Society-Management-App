import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  MediaPurpose,
  EntityType,
  DocumentType,
  VerificationStatus,
  MEDIA_PURPOSES,
  ENTITY_TYPES,
  DOCUMENT_TYPES,
  VERIFICATION_STATUSES,
} from '@repo/schema';

export type MediaDocument = Media & Document;

@Schema({ _id: false })
class MediaMetadata {
  @Prop({ type: String, enum: DOCUMENT_TYPES })
  documentType?: DocumentType;

  @Prop({ type: String })
  documentNumber?: string;

  @Prop({ type: String, enum: VERIFICATION_STATUSES })
  verificationStatus?: VerificationStatus;

  @Prop({ type: String })
  rejectionReason?: string;
}

const MediaMetadataSchema = SchemaFactory.createForClass(MediaMetadata);

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret: Record<string, any>) => {
      ret.mediaId = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Media {
  mediaId: string;

  @Prop({ required: true, type: String })
  societyId: string;

  @Prop({ required: true, type: String })
  uploadedBy: string;

  @Prop({ required: true, type: String })
  url: string;

  @Prop({ required: true, type: String })
  key: string;

  @Prop({ required: true, type: String })
  fileName: string;

  @Prop({ required: true, type: String })
  mimeType: string;

  @Prop({ required: true, type: Number })
  sizeBytes: number;

  @Prop({
    required: true,
    type: String,
    enum: MEDIA_PURPOSES,
  })
  purpose: MediaPurpose;

  @Prop({
    required: true,
    type: String,
    enum: ENTITY_TYPES,
  })
  entityType: EntityType;

  @Prop({ type: String })
  entityId?: string;

  @Prop({ type: MediaMetadataSchema })
  metadata?: MediaMetadata;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
