import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { VISITOR_STATUSES, VISITOR_TYPES } from '@repo/schema';
import * as crypto from 'crypto';

export type VisitorDocument = HydratedDocument<Visitor>;

@Schema({
  timestamps: true,
})
export class Visitor {
  @Prop({
    required: true,
    unique: true,
    default: () => `vst_${crypto.randomBytes(10).toString('hex')}`,
  })
  visitorId!: string;

  @Prop({ required: true, index: true })
  societyId!: string;

  @Prop({ required: true, index: true })
  flatId!: string;

  @Prop({ index: true })
  residentId?: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  mobile!: string;

  @Prop({ required: true, enum: VISITOR_TYPES })
  type!: string;

  @Prop()
  purpose?: string;

  @Prop()
  photoUrl?: string;

  @Prop({ index: true })
  passCode?: string;

  @Prop({ required: true, enum: VISITOR_STATUSES, default: 'pending' })
  status!: string;

  @Prop()
  visitedAt?: string;

  @Prop()
  exitedAt?: string;
}

export const VisitorSchema = SchemaFactory.createForClass(Visitor);

VisitorSchema.virtual('resident', {
  ref: 'User',
  localField: 'residentId',
  foreignField: 'userId',
  justOne: true,
});

VisitorSchema.virtual('flat', {
  ref: 'Flat',
  localField: 'flatId',
  foreignField: 'flatId',
  justOne: true,
});

VisitorSchema.set('toJSON', { virtuals: true });
VisitorSchema.set('toObject', { virtuals: true });
