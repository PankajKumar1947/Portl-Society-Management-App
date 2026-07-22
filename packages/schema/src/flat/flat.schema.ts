import z from "zod";

export const FLAT_STATUS = ["OCCUPIED", "VACANT", "UNDER_MAINTENANCE"] as const;
export const flatStatusSchema = z.enum(FLAT_STATUS);

export const flatSchema = z.object({
  flatId: z.string().min(1, "Flat ID is required"),
  societyId: z.string().min(1, "Society ID is required"),
  towerId: z.string().min(1, "Tower ID is required"),
  flatNumber: z.string().min(1, "Flat number is required"),
  floorNumber: z.number().optional(),
  numberOfRooms: z.number().nonnegative().optional(),
  numberOfBathrooms: z.number().nonnegative().optional(),
  kitchen: z.number().nonnegative().optional(),
  balcony: z.number().nonnegative().optional(),
  hallRoom: z.number().nonnegative().optional(),
  status: flatStatusSchema.default("VACANT"),
});

export const createFlatSchema = flatSchema.omit({
  flatId: true,
  societyId: true,
});

export const updateFlatSchema = createFlatSchema.partial().omit({
  towerId: true,
});

export const FLAT_STATUS_OPTIONS = [
  { label: "Vacant", value: "VACANT" },
  { label: "Occupied", value: "OCCUPIED" },
  { label: "Under Maintenance", value: "UNDER_MAINTENANCE" },
] as const;

// Flat Resident Relation Schema
export const RESIDENT_TYPES = ["OWNER", "TENANT", "FAMILY_MEMBER"] as const;
export const residentTypeSchema = z.enum(RESIDENT_TYPES);

export const flatResidentSchema = z.object({
  id: z.string().min(1, "ID is required"),
  flatId: z.string().min(1, "Flat ID is required"),
  userId: z.string().min(1, "User ID is required"),
  residentType: residentTypeSchema,
  isPrimary: z.boolean().default(false),
  moveInDate: z.string().optional(),
});

export const createFlatResidentSchema = flatResidentSchema.omit({
  id: true,
});
