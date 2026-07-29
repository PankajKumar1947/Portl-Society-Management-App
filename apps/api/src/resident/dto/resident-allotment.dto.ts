import { createZodDto } from 'nestjs-zod';
import {
  residentAllotmentSchema,
  ResidentKind,
  RelationshipType,
  OwnershipStatus,
  DocType,
} from '@repo/schema';

export class ResidentAllotmentDto extends createZodDto(residentAllotmentSchema) {
  userId!: string;
  residentType!: ResidentKind;
  towerId!: string;
  flatId!: string;
  moveInDate!: string;
  ownershipStatus!: OwnershipStatus;
  isPrimary!: boolean;
  docType!: DocType;
  documentNumber?: string;
}
