import { createZodDto } from 'nestjs-zod';
import { guardIdentificationSchema } from '@repo/schema';
import z from 'zod';

export class OnboardGuardIdentityDto extends createZodDto(guardIdentificationSchema.extend({
  userId: z.string().min(1, "User ID is required"),
})) {
  userId!: string;
  aadharNumber!: string;
  streetAddress!: string;
  city!: string;
  state!: string;
  country!: string;
  zipCode!: string;
  emergencyContact!: string;
}
