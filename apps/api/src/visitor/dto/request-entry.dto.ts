import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const requestEntrySchema = z.object({
  mobile: z.string().min(1, 'Mobile number is required'),
  name: z.string().optional(),
  type: z.string().optional(),
  purpose: z.string().optional(),
  flatId: z.string().optional(),
});

export class RequestEntryDto extends createZodDto(requestEntrySchema) {}
