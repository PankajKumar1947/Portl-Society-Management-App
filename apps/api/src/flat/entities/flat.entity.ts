import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { FLAT_STATUS, FlatStatus } from '@repo/schema';
import * as crypto from 'crypto';

export type FlatDocument = HydratedDocument<Flat>;

@Schema({
  timestamps: true,
})
export class Flat {
  @Prop({
    required: true,
    unique: true,
    default: () => `flt_${crypto.randomBytes(10).toString('hex')}`,
  })
  flatId!: string;

  @Prop({ required: true, index: true })
  societyId!: string;

  @Prop({ required: true, index: true })
  towerId!: string;

  @Prop({ required: true })
  flatNumber!: string;

  @Prop()
  floorNumber?: number;

  @Prop()
  numberOfRooms?: number;

  @Prop()
  numberOfBathrooms?: number;

  @Prop()
  kitchen?: number;

  @Prop()
  balcony?: number;

  @Prop()
  hallRoom?: number;

  @Prop({ required: true, enum: FLAT_STATUS, default: 'VACANT' })
  status!: FlatStatus;
}

export const FlatSchema = SchemaFactory.createForClass(Flat);
export const FlatEntity = FlatSchema;
