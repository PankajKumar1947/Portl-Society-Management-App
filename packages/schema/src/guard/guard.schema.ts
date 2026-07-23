import z from "zod";

export const SHIFT_TYPES = ["DAY", "NIGHT", "ROUTINE"] as const;
export const shiftTypeSchema = z.enum(SHIFT_TYPES);

export const GUARD_STATUSES = ["ACTIVE", "INACTIVE", "ON_LEAVE"] as const;
export const guardStatusSchema = z.enum(GUARD_STATUSES);

export const POLICE_VERIFICATION_STATUSES = ["VERIFIED", "PENDING", "NOT_DONE"] as const;
export const policeVerificationStatusSchema = z.enum(POLICE_VERIFICATION_STATUSES);

export const guardSchema = z.object({
  guardId: z.string().min(1, "Guard ID is required"),
  userId: z.string().min(1, "User ID is required"),
  societyId: z.string().min(1, "Society ID is required"),
  shiftType: shiftTypeSchema.default("DAY"),
  gateNumber: z.string().min(1, "Assigned gate number is required"),
  status: guardStatusSchema.default("ACTIVE"),
  joiningDate: z.string().optional(),
  agencyName: z.string().optional(),
  aadharNumber: z.string().min(12, "Aadhar number must be 12 digits").max(12, "Aadhar number must be 12 digits"),
  streetAddress: z.string().min(3, "Street address must be at least 3 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  zipCode: z.string().min(6, "Pin code must be 6 digits").max(6, "Pin code must be 6 digits"),
  emergencyContact: z.string().min(10, "Emergency contact must be 10 digits").max(10, "Emergency contact must be 10 digits"),
  policeVerificationStatus: policeVerificationStatusSchema.default("PENDING"),
});

export const guardPersonalSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

export const guardIdentificationSchema = z.object({
  aadharNumber: z.string().min(12, "Aadhar number must be 12 digits").max(12, "Aadhar number must be 12 digits"),
  streetAddress: z.string().min(3, "Street address must be at least 3 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  zipCode: z.string().min(6, "Pin code must be 6 digits").max(6, "Pin code must be 6 digits"),
  emergencyContact: z.string().min(10, "Emergency contact must be 10 digits").max(10, "Emergency contact must be 10 digits"),
});

export const guardDutySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  shiftType: shiftTypeSchema,
  gateNumber: z.string().min(1, "Assigned gate number is required"),
  agencyName: z.string().optional(),
  policeVerificationStatus: policeVerificationStatusSchema,
});

export const createGuardSchema = guardSchema.omit({
  guardId: true,
  userId: true,
  societyId: true,
}).extend({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

export const updateGuardSchema = createGuardSchema.partial();
export const guardFormSchema = createGuardSchema;
export const dutyFormSchema = guardDutySchema.omit({ userId: true });


