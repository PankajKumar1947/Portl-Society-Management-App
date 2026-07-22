import { createZodDto } from 'nestjs-zod';
import { residentVehicleSchema, VehicleType } from '@repo/schema';

export class ResidentVehicleDto extends createZodDto(residentVehicleSchema) {
  vehicleType!: VehicleType;
  vehicleNumber?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  parkingSlot?: string;
}
