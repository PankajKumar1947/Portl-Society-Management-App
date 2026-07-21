import { createZodDto } from 'nestjs-zod';
import { createTowerSchema } from '@repo/schema';

export class CreateTowerDto extends createZodDto(createTowerSchema) {
  societyId!: string;
  towerName!: string;
  location?: string;
  appNumber?: string;
  totalFloors?: number;
  totalFlats?: number;
}
