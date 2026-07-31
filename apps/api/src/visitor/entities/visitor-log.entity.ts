import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { VISITOR_STATUSES, VISITOR_TYPES } from '@repo/schema';
import * as crypto from 'crypto';

export type VisitorLogDocument = HydratedDocument<VisitorLog>;

class LogEntry {
  @Prop()
  enteredAt?: string;

  @Prop()
  exitedAt?: string;

  @Prop()
  scannedBy?: string;
}

@Schema({
  timestamps: true,
  collection: 'visitor_logs',
})
export class VisitorLog {
  @Prop({
    required: true,
    unique: true,
    default: () => `vlg_${crypto.randomBytes(10).toString('hex')}`,
  })
  logId!: string;

  @Prop({ required: true, index: true })
  societyId!: string;

  @Prop({ required: true, index: true })
  visitorId!: string;

  createdAt?: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  mobile!: string;

  @Prop({ index: true })
  flatId?: string;

  @Prop({ index: true })
  residentId?: string;

  @Prop({ index: true })
  createdBy?: string;

  @Prop({ required: true, enum: VISITOR_TYPES })
  type!: string;

  @Prop()
  purpose?: string;

  @Prop({ index: true })
  passCode?: string;

  @Prop({ required: true, enum: VISITOR_STATUSES, default: 'pending' })
  status!: string;

  @Prop({ type: [LogEntry], default: [] })
  entries!: LogEntry[];

  @Prop()
  validFrom?: string;

  @Prop()
  validTo?: string;
}

export const VisitorLogSchema = SchemaFactory.createForClass(VisitorLog);

VisitorLogSchema.virtual('visitor', {
  ref: 'Visitor',
  localField: 'visitorId',
  foreignField: 'visitorId',
  justOne: true,
});

VisitorLogSchema.virtual('resident', {
  ref: 'User',
  localField: 'residentId',
  foreignField: 'userId',
  justOne: true,
});

VisitorLogSchema.virtual('flat', {
  ref: 'Flat',
  localField: 'flatId',
  foreignField: 'flatId',
  justOne: true,
});

VisitorLogSchema.set('toJSON', { virtuals: true });
VisitorLogSchema.set('toObject', { virtuals: true });
