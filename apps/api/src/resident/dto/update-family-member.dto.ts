import { createZodDto } from 'nestjs-zod';
import { updateFamilyMemberSchema } from '@repo/schema';

export class UpdateFamilyMemberDto extends createZodDto(updateFamilyMemberSchema) {}
