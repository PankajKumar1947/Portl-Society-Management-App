import { createZodDto } from 'nestjs-zod';
import { registerFcmTokenSchema } from '@repo/schema';

export class RegisterFcmTokenDto extends createZodDto(registerFcmTokenSchema) {}
