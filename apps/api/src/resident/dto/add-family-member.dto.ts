import { createZodDto } from 'nestjs-zod';
import { addFamilyMemberSchema } from '@repo/schema';
import type { RelationshipType } from '@repo/schema';

export class AddFamilyMemberDto extends createZodDto(addFamilyMemberSchema) {
  firstName!: string;
  lastName!: string;
  relationship!: RelationshipType;
  phoneNumber?: string;
  dateOfBirth?: string;
}
