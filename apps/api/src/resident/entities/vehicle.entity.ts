import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { VEHICLE_TYPES } from '@repo/schema';
import * as crypto from 'crypto';

export type VehicleDocument = HydratedDocument<Vehicle>;

@Schema({
  timestamps: true,
})
export class Vehicle {
  @Prop({
    required: true,
    unique: true,
    default: () => `vhc_${crypto.randomBytes(10).toString('hex')}`,
  })
  vehicleId: string;

  @Prop({ required: true, index: true })
  residentId: string;

  @Prop({ required: true, enum: VEHICLE_TYPES })
  vehicleType: string;

  @Prop({ required: true })
  vehicleNumber: string;

  @Prop()
  vehicleBrand?: string;

  @Prop()
  vehicleModel?: string;

  @Prop()
  vehicleColor?: string;

  @Prop()
  parkingSlot?: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
export const VehicleEntity = VehicleSchema;
