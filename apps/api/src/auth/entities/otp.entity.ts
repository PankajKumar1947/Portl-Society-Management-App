import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true, index: true })
  email: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true, type: Date, expires: 300 }) // Auto delete after 5 minutes (300 seconds)
  expiresAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
export const OtpEntity = OtpSchema;
