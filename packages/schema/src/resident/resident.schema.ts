import z from "zod";

const _residentTypeSchema = z.enum(["OWNER", "TENANT", "FAMILY_MEMBER"]);

export const RELATIONSHIPS = ["SPOUSE", "SON", "DAUGHTER", "FATHER", "MOTHER", "BROTHER", "SISTER", "OTHER"] as const;
export const relationshipSchema = z.enum(RELATIONSHIPS);

export const OWNERSHIP_STATUSES = ["OWNER", "TENANT", "CO-OWNER"] as const;
export const ownershipStatusSchema = z.enum(OWNERSHIP_STATUSES);

export const VEHICLE_TYPES = ["NONE", "TWO_WHEELER", "FOUR_WHEELER"] as const;
export const vehicleTypeSchema = z.enum(VEHICLE_TYPES);

export const DOC_TYPES = ["NONE", "AADHAR", "PAN", "PASSPORT", "VOTER_ID"] as const;
export const docTypeSchema = z.enum(DOC_TYPES);

export const residentSchema = z.object({
  residentId: z.string().min(1, "Resident ID is required"),
  societyId: z.string().min(1, "Society ID is required"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  mobileNumber: z.string().length(10, "Mobile number must be 10 digits"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  residentType: _residentTypeSchema,
  relationship: relationshipSchema.optional().or(z.literal("")),
  towerId: z.string().min(1, "Tower is required"),
  flatNumber: z.string().min(1, "Flat number is required"),
  moveInDate: z.string().min(1, "Move-in date is required"),
  ownershipStatus: ownershipStatusSchema,
  isPrimary: z.boolean().default(false),

  // Vehicles
  vehicleType: vehicleTypeSchema.default("NONE"),
  vehicleNumber: z.string().optional().or(z.literal("")),
  vehicleBrand: z.string().optional().or(z.literal("")),
  vehicleModel: z.string().optional().or(z.literal("")),
  vehicleColor: z.string().optional().or(z.literal("")),
  parkingSlot: z.string().optional().or(z.literal("")),

  // Documents
  docType: docTypeSchema.default("NONE"),
  documentNumber: z.string().optional().or(z.literal("")),
});

export const createResidentSchema = residentSchema.omit({
  residentId: true,
});

export const updateResidentSchema = createResidentSchema.partial().omit({
  societyId: true,
});

// Form schema used in the mobile app (no residentId or societyId — those are injected at submit time)
export const residentFormSchema = residentSchema.omit({
  residentId: true,
  societyId: true,
});
