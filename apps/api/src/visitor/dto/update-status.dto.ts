import { createZodDto } from 'nestjs-zod';
import { updateVisitorStatusSchema } from '@repo/schema';

export class UpdateVisitorStatusDto extends createZodDto(updateVisitorStatusSchema) {}
