import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { FLAT_STATUS, FlatStatus } from '@repo/schema';

export type FlatDocument = HydratedDocument<Flat>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class Flat {
  @Prop({ required: true, unique: true })
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
