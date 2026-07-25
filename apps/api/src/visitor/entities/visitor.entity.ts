import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as crypto from 'crypto';

export type VisitorDocument = HydratedDocument<Visitor>;

@Schema({
  timestamps: true,
  collection: 'visitors',
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

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  mobile!: string;

  @Prop()
  photoUrl?: string;
}

export const VisitorSchema = SchemaFactory.createForClass(Visitor);

VisitorSchema.index({ mobile: 1, societyId: 1 }, { unique: true });

VisitorSchema.set('toJSON', { virtuals: true });
VisitorSchema.set('toObject', { virtuals: true });
