import { createZodDto } from 'nestjs-zod';
import { residentPersonalSchema } from '@repo/schema';

export class ResidentPersonalDto extends createZodDto(residentPersonalSchema) {
  firstName!: string;
  lastName!: string;
  mobileNumber!: string;
  email!: string;
}
