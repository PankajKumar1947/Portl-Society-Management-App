import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { NOTIFICATION_TYPES } from '@repo/schema';
import * as crypto from 'crypto';

export type NotificationDocument = HydratedDocument<NotificationItem>;

@Schema({
  timestamps: true,
  collection: 'notifications',
})
export class NotificationItem {
  @Prop({
    required: true,
    unique: true,
    default: () => `ntf_${crypto.randomBytes(10).toString('hex')}`,
  })
  notificationId: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, enum: NOTIFICATION_TYPES })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ type: Object })
  data?: Record<string, unknown>;

  @Prop({ default: false })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationItem);

NotificationSchema.set('toJSON', { virtuals: true });
NotificationSchema.set('toObject', { virtuals: true });

export const NotificationEntity = NotificationSchema;
