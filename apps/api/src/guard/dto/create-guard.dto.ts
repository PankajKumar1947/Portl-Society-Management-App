import { createZodDto } from 'nestjs-zod';
import { createGuardSchema, ShiftType } from '@repo/schema';

export class CreateGuardDto extends createZodDto(createGuardSchema) {
  firstName!: string;
  lastName!: string;
  email!: string;
  phoneNumber!: string;
  shiftType!: ShiftType;
  gateNumber!: string;
  agencyName?: string;
}
