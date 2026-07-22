import { createZodDto } from 'nestjs-zod';
import {
  createResidentSchema,
  ResidentKind,
  RelationshipType,
  OwnershipStatus,
  VehicleType,
  DocType,
} from '@repo/schema';

export class CreateResidentDto extends createZodDto(createResidentSchema) {
  societyId!: string;
  firstName!: string;
  lastName!: string;
  mobileNumber!: string;
  email?: string;
  residentType!: ResidentKind;
  relationship?: RelationshipType | '';
  towerId!: string;
  flatNumber!: string;
  moveInDate!: string;
  ownershipStatus!: OwnershipStatus;
  isPrimary!: boolean;
  vehicleType!: VehicleType;
  vehicleNumber?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  parkingSlot?: string;
  docType!: DocType;
  documentNumber?: string;
}
