import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RELATIONSHIPS } from '@repo/schema';
import * as crypto from 'crypto';

export type FamilyMemberDocument = HydratedDocument<FamilyMember>;

@Schema({ timestamps: true })
export class FamilyMember {
  @Prop({
    required: true,
    unique: true,
    default: () => `fm_${crypto.randomBytes(10).toString('hex')}`,
  })
  familyMemberId: string;

  @Prop({ required: true, index: true })
  societyId: string;

  @Prop({ required: true, index: true })
  residentId: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, enum: RELATIONSHIPS })
  relationship: string;

  @Prop()
  phoneNumber?: string;

  @Prop()
  dateOfBirth?: string;

  @Prop({ required: true, index: true })
  towerId: string;

  @Prop({ required: true, index: true })
  flatId: string;
}

export const FamilyMemberEntity = SchemaFactory.createForClass(FamilyMember);

FamilyMemberEntity.virtual('flat', {
  ref: 'Flat',
  localField: 'flatId',
  foreignField: 'flatId',
  justOne: true,
});

FamilyMemberEntity.virtual('tower', {
  ref: 'Tower',
  localField: 'towerId',
  foreignField: 'towerId',
  justOne: true,
});

FamilyMemberEntity.set('toJSON', { virtuals: true });
FamilyMemberEntity.set('toObject', { virtuals: true });
