import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SHIFT_TYPES, GUARD_STATUSES, POLICE_VERIFICATION_STATUSES } from '@repo/schema';
import * as crypto from 'crypto';

export type GuardDocument = HydratedDocument<Guard>;

@Schema({
  timestamps: true,
})
export class Guard {
  @Prop({
    required: true,
    unique: true,
    default: () => `grd_${crypto.randomBytes(10).toString('hex')}`,
  })
  guardId: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, index: true })
  societyId: string;

  @Prop({ required: true, enum: SHIFT_TYPES, default: 'DAY' })
  shiftType: string;

  @Prop({ required: true })
  gateNumber: string;

  @Prop({ required: true, enum: GUARD_STATUSES, default: 'ACTIVE' })
  status: string;

  @Prop()
  joiningDate?: string;

  @Prop()
  agencyName?: string;

  @Prop({ required: true, unique: true, index: true })
  aadharNumber: string;

  @Prop({ required: true })
  streetAddress: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  zipCode: string;

  @Prop({ required: true })
  emergencyContact: string;

  @Prop({ required: true, enum: POLICE_VERIFICATION_STATUSES, default: 'PENDING' })
  policeVerificationStatus: string;
}

export const GuardSchema = SchemaFactory.createForClass(Guard);

GuardSchema.virtual('userDetails', {
  ref: 'User',
  localField: 'userId',
  foreignField: 'userId',
  justOne: true,
});

GuardSchema.set('toJSON', { virtuals: true });
GuardSchema.set('toObject', { virtuals: true });

export const GuardEntity = GuardSchema;
