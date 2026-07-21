import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SOCIETY_TYPES, SocietyType } from '@repo/schema';

export type SocietyDocument = HydratedDocument<Society>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class Society {
  @Prop({ required: true, unique: true })
  societyId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  societyName: string;

  @Prop({ required: true, unique: true })
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

  @Prop()
  address?: string;
}

export const SocietySchema = SchemaFactory.createForClass(Society);
export const SocietyEntity = SocietySchema;
