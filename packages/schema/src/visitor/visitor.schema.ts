import z from "zod";

export const VISITOR_TYPES = ["guest", "delivery", "cab", "service_staff"] as const;
export const visitorTypeSchema = z.enum(VISITOR_TYPES);

export const VISITOR_STATUSES = ["pending", "approved", "rejected", "completed"] as const;
export const visitorStatusSchema = z.enum(VISITOR_STATUSES);

export const visitorSchema = z.object({
  visitorId: z.string().min(1, "Visitor ID is required"),
  societyId: z.string().min(1, "Society ID is required"),
  flatId: z.string().optional(),
  residentId: z.string().optional(),
  name: z.string().min(1, "Visitor name is required"),
  mobile: z.string().min(1, "Mobile number is required"),
  type: visitorTypeSchema,
  purpose: z.string().optional(),
  photoUrl: z.string().optional(),
  passCode: z.string().optional(),
  status: visitorStatusSchema.default("pending"),
  visitedAt: z.string().optional(),
  exitedAt: z.string().optional(),
  createdAt: z.string().optional(),
});

export const createVisitorSchema = visitorSchema.omit({
  visitorId: true,
  societyId: true,
  passCode: true,
  status: true,
  visitedAt: true,
  exitedAt: true,
  createdAt: true,
});

export const updateVisitorSchema = createVisitorSchema.partial();
