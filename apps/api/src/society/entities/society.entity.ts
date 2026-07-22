import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SOCIETY_TYPES, SocietyType } from '@repo/schema';
import * as crypto from 'crypto';

export type SocietyDocument = HydratedDocument<Society>;

@Schema({
  timestamps: true,
})
export class Society {
  @Prop({
    required: true,
    unique: true,
    default: () => `soc_${crypto.randomBytes(10).toString('hex')}`,
  })
  societyId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  societyName: string;

  @Prop({
    required: true,
    unique: true,
    default: () => crypto.randomBytes(3).toString('hex').toUpperCase(),
  })
  societyCode: string;

  @Prop({ required: true, enum: SOCIETY_TYPES })
  societyType: SocietyType;

  @Prop({ required: true })
  primaryContactName: string;

  @Prop({ required: true })
  primaryContactNumber: string;

  @Prop({ required: true })
  primaryContactEmail: string;

  @Prop()
  establishedYear?: number;

  @Prop({ required: true })
  addressLine!: string;

  @Prop({ required: true })
  city!: string;

  @Prop({ required: true })
  state!: string;

  @Prop({ required: true })
  country!: string;

  @Prop({ required: true })
  pincode!: string;

  @Prop()
  geoLocation?: string;

  @Prop()
  supportMail?: string;

  @Prop()
  supportCall?: string;

  @Prop()
  website?: string;

  @Prop()
  logo?: string;

  @Prop()
  coverImage?: string;

  @Prop({ default: 'open', enum: ['open', 'closed'] })
  status?: string;
}

export const SocietySchema = SchemaFactory.createForClass(Society);
export const SocietyEntity = SocietySchema;
