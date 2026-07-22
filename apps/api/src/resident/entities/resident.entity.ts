import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  RESIDENT_TYPES,
  RELATIONSHIPS,
  OWNERSHIP_STATUSES,
  VEHICLE_TYPES,
  DOC_TYPES,
} from '@repo/schema';
import * as crypto from 'crypto';

export type ResidentDocument = HydratedDocument<Resident>;

@Schema({
  timestamps: true,
})
export class Resident {
  @Prop({
    required: true,
    unique: true,
    default: () => `res_${crypto.randomBytes(10).toString('hex')}`,
  })
  residentId: string;

  @Prop({ required: true, index: true })
  societyId: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, enum: RESIDENT_TYPES })
  residentType: string;

  @Prop({ enum: RELATIONSHIPS })
  relationship?: string;

  @Prop({ required: true, index: true })
  towerId: string;

  @Prop({ required: true })
  flatNumber: string;

  @Prop({ required: true })
  moveInDate: string;

  @Prop({ required: true, enum: OWNERSHIP_STATUSES })
  ownershipStatus: string;

  @Prop({ required: true, default: false })
  isPrimary: boolean;

  // Documents
  @Prop({ enum: DOC_TYPES, default: 'NONE' })
  docType!: string;

  @Prop()
  documentNumber?: string;
}

export const ResidentSchema = SchemaFactory.createForClass(Resident);

ResidentSchema.virtual('userDetails', {
  ref: 'User',
  localField: 'userId',
  foreignField: 'userId',
  justOne: true,
});

ResidentSchema.virtual('vehicles', {
  ref: 'Vehicle',
  localField: 'residentId',
  foreignField: 'residentId',
  justOne: false,
});

ResidentSchema.set('toJSON', { virtuals: true });
ResidentSchema.set('toObject', { virtuals: true });

export const ResidentEntity = ResidentSchema;
