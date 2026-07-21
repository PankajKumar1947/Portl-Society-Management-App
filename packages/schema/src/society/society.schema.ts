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
    .number()
    .min(1800, "Established year must be 1800 or later")
    .max(new Date().getFullYear(), "Established year cannot be in the future")
    .optional(),
  address: z.string().min(5, "Address must be at least 5 characters").optional(),
});

export const createSocietySchema = societySchema.omit({
  societyId: true,
  userId: true,
  societyCode: true,
});

export const updateSocietySchema = createSocietySchema.partial();


export const SOCIETY_TYPE_OPTIONS = [
  { label: "Apartment", value: "APARTMENT" },
  { label: "Gated Community", value: "GATED_COMMUNITY" },
  { label: "Villa", value: "VILLA" },
  { label: "Residential Complex", value: "RESIDENTIAL_COMPLEX" },
  { label: "Mixed Use Building", value: "MIXED_USE" },
] as const;

export const getEstablishedYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: currentYear - 1800 + 1 }, (_, i) => {
    const year = currentYear - i;
    return { label: year.toString(), value: year.toString() };
  });
};

export const ESTABLISHED_YEAR_OPTIONS = getEstablishedYearOptions();

