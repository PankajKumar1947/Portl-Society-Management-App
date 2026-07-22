import { createZodDto } from 'nestjs-zod';
import { createFlatSchema, FlatStatus } from '@repo/schema';

export class CreateFlatDto extends createZodDto(createFlatSchema) {
  towerId!: string;
  flatNumber!: string;
  floorNumber?: number;
  numberOfRooms?: number;
  numberOfBathrooms?: number;
  kitchen?: number;
  balcony?: number;
  hallRoom?: number;
  status!: FlatStatus;
}
