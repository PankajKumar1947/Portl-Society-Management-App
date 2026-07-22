import z from "zod";

export const SOCIETY_TYPES = [
  "APARTMENT",
  "GATED_COMMUNITY",
  "VILLA",
  "RESIDENTIAL_COMPLEX",
  "MIXED_USE",
] as const;

export const societyTypeSchema = z.enum(SOCIETY_TYPES);

export const SOCIETY_STATUSES = ["open", "closed"] as const;
export const societyStatusSchema = z.enum(SOCIETY_STATUSES);

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
  addressLine: z.string().min(1, "Address line is required").max(200),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  country: z.string().min(1, "Country is required").max(100),
  pincode: z.string().min(6, "Pincode must be at least 6 characters").max(10),
  geoLocation: z.string().optional(),
  supportMail: z.string().email("Invalid support email").optional().or(z.literal("")),
  supportCall: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
  status: societyStatusSchema.default("open"),
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

export const SOCIETY_STATUS_OPTIONS = [
  { label: "Open / Active", value: "open" },
  { label: "Closed / Inactive", value: "closed" },
] as const;

export const getEstablishedYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: currentYear - 1800 + 1 }, (_, i) => {
    const year = currentYear - i;
    return { label: year.toString(), value: year };
  });
};

export const ESTABLISHED_YEAR_OPTIONS = getEstablishedYearOptions();

