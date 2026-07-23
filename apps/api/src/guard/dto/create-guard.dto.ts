import { createZodDto } from 'nestjs-zod';
import { createGuardSchema, ShiftType, PoliceVerificationStatus } from '@repo/schema';

export class CreateGuardDto extends createZodDto(createGuardSchema) {
  firstName!: string;
  lastName!: string;
  email!: string;
  phoneNumber!: string;
  shiftType!: ShiftType;
  gateNumber!: string;
  agencyName?: string;
  aadharNumber!: string;
  streetAddress!: string;
  city!: string;
  state!: string;
  country!: string;
  zipCode!: string;
  emergencyContact!: string;
  policeVerificationStatus!: PoliceVerificationStatus;
}
