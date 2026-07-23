import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { NOTICE_RECIPIENTS, NOTICE_STATUSES } from '@repo/schema';
import * as crypto from 'crypto';

export type NoticeDocument = HydratedDocument<Notice>;

@Schema({
  timestamps: true,
})
export class Notice {
  @Prop({
    required: true,
    unique: true,
    default: () => `ntc_${crypto.randomBytes(10).toString('hex')}`,
  })
  noticeId: string;

  @Prop({ required: true, index: true })
  societyId: string;

  @Prop({ type: [String], default: [] })
  towerIds?: string[];

  @Prop({ required: true, type: [String], enum: NOTICE_RECIPIENTS })
  recipient: string[];

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  attachments?: string[];

  @Prop({ required: true, enum: NOTICE_STATUSES, default: 'draft' })
  status: string;

  @Prop({ required: true, index: true })
  createdBy: string;

  @Prop()
  publishedOn?: string;
}

export const NoticeSchema = SchemaFactory.createForClass(Notice);

NoticeSchema.virtual('publisher', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: 'userId',
  justOne: true,
});

NoticeSchema.virtual('attachmentList', {
  ref: 'Media',
  localField: 'attachments',
  foreignField: '_id',
});

NoticeSchema.set('toJSON', { virtuals: true });
NoticeSchema.set('toObject', { virtuals: true });
