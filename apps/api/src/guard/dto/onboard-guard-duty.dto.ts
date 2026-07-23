import { createZodDto } from 'nestjs-zod';
import { guardDutySchema, ShiftType, PoliceVerificationStatus } from '@repo/schema';

export class OnboardGuardDutyDto extends createZodDto(guardDutySchema) {
  userId!: string;
  shiftType!: ShiftType;
  gateNumber!: string;
  agencyName?: string;
  policeVerificationStatus!: PoliceVerificationStatus;
}
