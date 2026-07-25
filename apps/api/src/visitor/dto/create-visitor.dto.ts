import { createZodDto } from 'nestjs-zod';
import { createVisitorSchema } from '@repo/schema';

export class CreateVisitorDto extends createZodDto(createVisitorSchema) {}
