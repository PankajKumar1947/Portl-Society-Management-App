import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const castVoteSchema = z.object({
  optionId: z.string().min(1, 'Option ID is required'),
});

export class CastVoteDto extends createZodDto(castVoteSchema) {}
