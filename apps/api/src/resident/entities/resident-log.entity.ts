import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as crypto from 'crypto';

import { Resident } from './resident.entity';

export type ResidentLogDocument = HydratedDocument<ResidentLog>;

@Schema({
  timestamps: true,
  collection: 'resident_logs',
})
export class ResidentLog {
  @Prop({
    required: true,
    unique: true,
    default: () => `rlg_${crypto.randomBytes(10).toString('hex')}`,
  })
  logId!: string;

  @Prop({ required: true, index: true })
  societyId!: string;

  @Prop({ required: true, index: true })
  passCode!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, enum: ['RESIDENT', 'FAMILY_MEMBER'] })
  type!: string;

  @Prop({ index: true })
  residentId?: string;

  @Prop({ index: true })
  familyMemberId?: string;

  @Prop({ required: true, enum: ['entry', 'exit'] })
  action!: string;

  @Prop({ required: true })
  timestamp!: string;

  @Prop({ required: true, index: true })
  scannedBy!: string; // The guard who scanned the pass

  resident?: Resident;
}

export const ResidentLogSchema = SchemaFactory.createForClass(ResidentLog);

ResidentLogSchema.virtual('resident', {
  ref: 'Resident',
  localField: 'residentId',
  foreignField: 'residentId',
  justOne: true,
});

ResidentLogSchema.set('toJSON', { virtuals: true });
ResidentLogSchema.set('toObject', { virtuals: true });

export const ResidentLogEntity = ResidentLogSchema;
