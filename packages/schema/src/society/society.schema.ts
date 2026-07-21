import z from "zod";

export const SOCIETY_TYPES = [
  "APARTMENT",
  "GATED_COMMUNITY",
  "VILLA",
  "RESIDENTIAL_COMPLEX",
  "MIXED_USE",
] as const;

export const societyTypeSchema = z.enum(SOCIETY_TYPES);

export const societySchema = z.object({
  societyId: z.string().min(1, "Society ID is required"),
  userId: z.string().min(1, "User ID is required"),
  societyName: z.string().min(1, "Society Name is required").max(100),
  societyCode: z.string().min(3, "Society Code must be at least 3 characters").max(20),
  societyType: societyTypeSchema,
  primaryContactName: z.string().min(1, "Primary Contact Name is required"),
  primaryContactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15)
    .regex(/^[0-9]+$/, "Contact number must contain only numbers"),
  primaryContactEmail: z.string().email("Invalid email address"),
  establishedYear: z
    .union([z.number(), z.string()])
    .transform((val) => (val === "" || val === undefined ? undefined : Number(val)))
    .refine((val) => val === undefined || (val >= 1800 && val <= new Date().getFullYear()), {
      message: "Established year must be between 1800 and current year",
    })
    .optional(),
  address: z.string().min(5, "Address must be at least 5 characters").optional(),
});

export const createSocietySchema = societySchema.omit({
  societyId: true,
  userId: true,
  societyCode: true,
});

export const updateSocietySchema = createSocietySchema.partial();
