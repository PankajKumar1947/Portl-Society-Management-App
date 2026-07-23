import { createZodDto } from 'nestjs-zod';
import { guardPersonalSchema } from '@repo/schema';

export class OnboardGuardPersonalDto extends createZodDto(guardPersonalSchema) {
  firstName!: string;
  lastName!: string;
  email!: string;
  phoneNumber!: string;
}
