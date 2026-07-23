import z from "zod";

export const SHIFT_TYPES = ["DAY", "NIGHT", "ROUTINE"] as const;
export const shiftTypeSchema = z.enum(SHIFT_TYPES);

export const GUARD_STATUSES = ["ACTIVE", "INACTIVE", "ON_LEAVE"] as const;
export const guardStatusSchema = z.enum(GUARD_STATUSES);

export const guardSchema = z.object({
  guardId: z.string().min(1, "Guard ID is required"),
  userId: z.string().min(1, "User ID is required"),
  societyId: z.string().min(1, "Society ID is required"),
  shiftType: shiftTypeSchema.default("DAY"),
  gateNumber: z.string().min(1, "Assigned gate number is required"),
  status: guardStatusSchema.default("ACTIVE"),
  joiningDate: z.string().optional(),
  agencyName: z.string().optional(),
});

export const guardPersonalSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

export const guardDutySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  shiftType: shiftTypeSchema.default("DAY"),
  gateNumber: z.string().min(1, "Assigned gate number is required"),
  agencyName: z.string().optional(),
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

