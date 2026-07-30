import z from "zod";

export const VISITOR_TYPES = ["guest", "delivery", "cab", "service_staff"] as const;
export const VISITOR_TYPE = { GUEST: "guest", DELIVERY: "delivery", CAB: "cab", SERVICE_STAFF: "service_staff" } as const;
export const visitorTypeSchema = z.enum(VISITOR_TYPES);

export const VISITOR_STATUSES = ["pending", "approved", "rejected", "completed", "active"] as const;
export const VISITOR_STATUS = { PENDING: "pending", APPROVED: "approved", REJECTED: "rejected", COMPLETED: "completed", ACTIVE: "active" } as const;
export const visitorStatusSchema = z.enum(VISITOR_STATUSES);

export const UPDATABLE_VISITOR_STATUSES = ["pending", "approved", "rejected", "completed"] as const;
export const UPDATABLE_VISITOR_STATUS = { PENDING: "pending", APPROVED: "approved", REJECTED: "rejected", COMPLETED: "completed" } as const;
export const updateVisitorStatusSchema = z.object({
  status: z.enum(UPDATABLE_VISITOR_STATUSES),
});

export const SCAN_DIRECTIONS = ["entry", "exit"] as const;
export const SCAN_DIRECTION = { ENTRY: "entry", EXIT: "exit" } as const;

export const visitorProfileSchema = z.object({
  visitorId: z.string().min(1),
  societyId: z.string().min(1),
  name: z.string().min(1),
  mobile: z.string().min(1),
  photoUrl: z.string().optional(),
  createdAt: z.string().optional(),
});

export const visitorLogEntrySchema = z.object({
  enteredAt: z.string().optional(),
  exitedAt: z.string().optional(),
  scannedBy: z.string().optional(),
});

export const visitorLogSchema = z.object({
  logId: z.string().min(1),
  societyId: z.string().min(1),
  visitorId: z.string().min(1),
  name: z.string().min(1),
  mobile: z.string().min(1),
  flatId: z.string().optional(),
  residentId: z.string().optional(),
  type: visitorTypeSchema,
  purpose: z.string().optional(),
  passCode: z.string().optional(),
  status: visitorStatusSchema.default("pending"),
  entries: z.array(visitorLogEntrySchema).default([]),
  validFrom: z.string().optional(),
  validTo: z.string().optional(),
  createdBy: z.string().optional(),
  createdAt: z.string().optional(),
});

export const createVisitorSchema = z.object({
  name: z.string().min(1, "Visitor name is required"),
  mobile: z.string().min(1, "Mobile number is required"),
  type: visitorTypeSchema,
  purpose: z.string().optional(),
  flatId: z.string().optional(),
  validFrom: z.string().optional(),
  validTo: z.string().optional(),
  preApprove: z.boolean().optional(),
});

export const updateVisitorLogSchema = createVisitorSchema.partial();
