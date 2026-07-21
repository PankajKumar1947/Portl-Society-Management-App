import { createZodDto } from 'nestjs-zod';
import { createSocietySchema, SocietyType } from '@repo/schema';

export class CreateSocietyDto extends createZodDto(createSocietySchema) {
  societyName!: string;
  societyType!: SocietyType;
  primaryContactName!: string;
  primaryContactNumber!: string;
  primaryContactEmail!: string;
  establishedYear?: number;
  address?: string;
}
