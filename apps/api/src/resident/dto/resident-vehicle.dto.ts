import { createZodDto } from 'nestjs-zod';
import { residentVehicleSchema, VehicleInput } from '@repo/schema';

export class ResidentVehicleDto extends createZodDto(residentVehicleSchema) {
  vehicles!: VehicleInput[];
}
