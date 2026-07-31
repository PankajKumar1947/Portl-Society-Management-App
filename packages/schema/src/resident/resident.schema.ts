import z from "zod";

const _residentTypeSchema = z.enum(["SINGLE", "FAMILY", "COUPLE"]);

export const RELATIONSHIPS = ["SPOUSE", "SON", "DAUGHTER", "FATHER", "MOTHER", "BROTHER", "SISTER", "OTHER"] as const;
export const relationshipSchema = z.enum(RELATIONSHIPS);

export const OWNERSHIP_STATUSES = ["OWNER", "TENANT", "CO-OWNER"] as const;
export const ownershipStatusSchema = z.enum(OWNERSHIP_STATUSES);

export const VEHICLE_TYPES = ["NONE", "TWO_WHEELER", "FOUR_WHEELER"] as const;
export const vehicleTypeSchema = z.enum(VEHICLE_TYPES);

export const DOC_TYPES = ["NONE", "AADHAR", "PAN", "PASSPORT", "VOTER_ID"] as const;
export const docTypeSchema = z.enum(DOC_TYPES);

export const vehicleSchema = z.object({
  vehicleType: vehicleTypeSchema,
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
  vehicleBrand: z.string().optional().or(z.literal("")),
  vehicleModel: z.string().optional().or(z.literal("")),
  vehicleColor: z.string().optional().or(z.literal("")),
  parkingSlot: z.string().optional().or(z.literal("")),
});

export const residentSchema = z.object({
  residentId: z.string().min(1, "Resident ID is required"),
  societyId: z.string().min(1, "Society ID is required"),
  userId: z.string().min(1, "User ID is required"),
  residentType: _residentTypeSchema,
  towerId: z.string().min(1, "Tower is required"),
  flatId: z.string().min(1, "Flat is required"),
  moveInDate: z.string().min(1, "Move-in date is required"),
  ownershipStatus: ownershipStatusSchema,
  isPrimary: z.boolean().default(false),

  // Vehicles
  vehicles: z.array(vehicleSchema).default([]),

  // Documents
  docType: docTypeSchema.default("NONE"),
  documentNumber: z.string().optional().or(z.literal("")),

  // Passcode
  passCode: z.string().optional(),
});

export const createResidentSchema = residentSchema.omit({
  residentId: true,
});

export const updateResidentSchema = createResidentSchema.partial().omit({
  societyId: true,
});

// Form schema used in the mobile app - contains both personal and resident fields
export const residentFormSchema = residentSchema.omit({
  residentId: true,
  societyId: true,
  userId: true,
}).extend({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  mobileNumber: z.string().length(10, "Mobile number must be 10 digits"),
  email: z.string().email("Invalid email address"),
});

// Personal Details
export const residentPersonalSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  mobileNumber: z.string().length(10, "Mobile number must be 10 digits"),
  email: z.string().email("Invalid email address"),
});

// Allotment Details
export const residentAllotmentSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  residentType: _residentTypeSchema,
  towerId: z.string().min(1, "Tower is required"),
  flatId: z.string().min(1, "Flat is required"),
  moveInDate: z.string().min(1, "Move-in date is required"),
  ownershipStatus: ownershipStatusSchema,
  isPrimary: z.boolean().default(false),
  docType: docTypeSchema.default("NONE"),
  documentNumber: z.string().optional().or(z.literal("")),
});

// Vehicle Details
export const residentVehicleSchema = z.object({
  vehicles: z.array(vehicleSchema).default([]),
});



