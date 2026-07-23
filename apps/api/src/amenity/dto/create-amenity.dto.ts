import { createZodDto } from "nestjs-zod";
import { createAmenitySchema, AmenityCategory, AmenityType, AmenityStatus, OperatingHour } from "@repo/schema";

export class CreateAmenityDto extends createZodDto(createAmenitySchema) {
  name!: string;
  description?: string;
  category!: AmenityCategory;
  type!: AmenityType;
  towerIds!: string[];
  floorNumber?: string;
  location?: string;
  thumbnail?: string;
  gallery!: string[];
  capacity!: number;
  bookingRequired!: boolean;
  bookingDuration?: number;
  bookingFee!: number;
  openHours!: OperatingHour[];
  status!: AmenityStatus;
  rules?: string;
}
