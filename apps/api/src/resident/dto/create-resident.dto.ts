import { createZodDto } from 'nestjs-zod';
import {
  createResidentSchema,
  ResidentKind,
  RelationshipType,
  OwnershipStatus,
  DocType,
  VehicleInput,
} from '@repo/schema';

export class CreateResidentDto extends createZodDto(createResidentSchema) {
  societyId!: string;
  userId!: string;
  residentType!: ResidentKind;
  towerId!: string;
  flatId!: string;
  moveInDate!: string;
  ownershipStatus!: OwnershipStatus;
  isPrimary!: boolean;
  vehicles!: VehicleInput[];
  docType!: DocType;
  documentNumber?: string;
}
