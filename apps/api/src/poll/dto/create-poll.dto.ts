import { createZodDto } from 'nestjs-zod';
import { createPollSchema } from '@repo/schema';

export class CreatePollDto extends createZodDto(createPollSchema) {}
