import { createZodDto } from 'nestjs-zod';
import { createNoticeSchema } from '@repo/schema';

export class CreateNoticeDto extends createZodDto(createNoticeSchema) {}
