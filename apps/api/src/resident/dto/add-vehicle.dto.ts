import { createZodDto } from 'nestjs-zod';
import { vehicleSchema } from '@repo/schema';

export class AddVehicleDto extends createZodDto(vehicleSchema) {}
