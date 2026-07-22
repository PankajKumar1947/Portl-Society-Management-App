import { createZodDto } from 'nestjs-zod';
import { createSocietySchema, SocietyType, SocietyStatus } from '@repo/schema';

export class CreateSocietyDto extends createZodDto(createSocietySchema) {
  societyName!: string;
  societyType!: SocietyType;
  primaryContactName!: string;
  primaryContactNumber!: string;
  primaryContactEmail!: string;
  establishedYear?: number;
  addressLine!: string;
  city!: string;
  state!: string;
  country!: string;
  pincode!: string;
  geoLocation?: string;
  supportMail?: string;
  supportCall?: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  status!: SocietyStatus;
}
