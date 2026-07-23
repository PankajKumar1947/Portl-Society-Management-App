import z from "zod";
import {
  amenitySchema,
  createAmenitySchema,
  updateAmenitySchema,
  operatingHourSchema,
  AMENITY_CATEGORIES,
  AMENITY_TYPES,
  AMENITY_STATUSES,
} from "./amenity.schema";
import { ApiResponse } from "../shared/api.type";
import { MediaData } from "../media/media.type";

export type AmenityCategory = (typeof AMENITY_CATEGORIES)[number];
export type AmenityType = (typeof AMENITY_TYPES)[number];
export type AmenityStatus = (typeof AMENITY_STATUSES)[number];

export type OperatingHour = z.infer<typeof operatingHourSchema>;
export type AmenityData = z.infer<typeof amenitySchema> & {
  thumbnailFile?: MediaData;
  galleryFiles?: MediaData[];
};

export type CreateAmenityBody = z.infer<typeof createAmenitySchema>;
export type UpdateAmenityBody = z.infer<typeof updateAmenitySchema>;

export type AmenityResponse = ApiResponse<AmenityData>;
export type AmenityListResponse = ApiResponse<AmenityData[]>;

export interface AmenityFilterOptions {
  search?: string;
  category?: string;
  type?: string;
  status?: string;
  towerIds?: string[];
}

export const AmenityCategories = {
  CLUBHOUSE: "CLUBHOUSE",
  GYM: "GYM",
  SWIMMING_POOL: "SWIMMING_POOL",
  TENNIS: "TENNIS",
  BADMINTON: "BADMINTON",
  PARTY_HALL: "PARTY_HALL",
  BBQ_AREA: "BBQ_AREA",
  LIBRARY: "LIBRARY",
  GUEST_ROOM: "GUEST_ROOM",
  THEATER: "THEATER",
} as const;

export const AmenityTypes = {
  INDOOR: "INDOOR",
  OUTDOOR: "OUTDOOR",
} as const;

export const AmenityStatuses = {
  ACTIVE: "ACTIVE",
  UNDER_MAINTENANCE: "UNDER_MAINTENANCE",
  CLOSED: "CLOSED",
} as const;
