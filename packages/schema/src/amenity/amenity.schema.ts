import z from "zod";

export const AMENITY_CATEGORIES = [
  "CLUBHOUSE",
  "GYM",
  "SWIMMING_POOL",
  "TENNIS",
  "BADMINTON",
  "PARTY_HALL",
  "BBQ_AREA",
  "LIBRARY",
  "GUEST_ROOM",
  "THEATER",
] as const;

export const AMENITY_TYPES = ["INDOOR", "OUTDOOR"] as const;

export const AMENITY_STATUSES = ["ACTIVE", "UNDER_MAINTENANCE", "CLOSED"] as const;

export const amenityCategorySchema = z.enum(AMENITY_CATEGORIES);
export const amenityTypeSchema = z.enum(AMENITY_TYPES);
export const amenityStatusSchema = z.enum(AMENITY_STATUSES);

export const operatingHourSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  openTime: z.string(),
  closeTime: z.string(),
  isClosed: z.boolean().default(false),
});

export const amenitySchema = z.object({
  amenityId: z.string(),
  societyId: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: amenityCategorySchema,
  type: amenityTypeSchema,
  towerIds: z.array(z.string()).default([]),
  floorNumber: z.string().optional(),
  location: z.string().optional(),
  thumbnail: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  capacity: z.number().min(1).default(50),
  bookingRequired: z.boolean().default(false),
  bookingDuration: z.number().min(1).optional(), // in minutes
  bookingFee: z.number().min(0).default(0),
  openHours: z.array(operatingHourSchema).default([]),
  status: amenityStatusSchema.default("ACTIVE"),
  rules: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createAmenitySchema = amenitySchema.omit({
  amenityId: true,
  societyId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateAmenitySchema = createAmenitySchema.partial();
