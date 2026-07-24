import z from "zod";

export const TICKET_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED"] as const;
export const TICKET_STATUS = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  REJECTED: "REJECTED",
} as const;
export const ticketStatusSchema = z.enum(TICKET_STATUSES);

export const TICKET_CATEGORIES = [
  "MAINTENANCE",
  "PLUMBING",
  "ELECTRICAL",
  "SECURITY",
  "HOUSEKEEPING",
  "OTHER",
] as const;
export const ticketCategorySchema = z.enum(TICKET_CATEGORIES);

export const helpdeskTimelineEntrySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.string().min(1),
  updatedBy: z.string().min(1),
  createdAt: z.string().optional(),
});

export const helpdeskTicketSchema = z.object({
  ticketId: z.string().min(1),
  societyId: z.string().min(1),
  category: ticketCategorySchema,
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(1, "Description is required"),
  status: ticketStatusSchema.default("OPEN"),
  reportedBy: z.string().min(1),
  assignedTo: z.string().optional(),
  attachments: z.array(z.string()).default([]),
  timeline: z.array(helpdeskTimelineEntrySchema).default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const createHelpdeskTicketSchema = helpdeskTicketSchema.omit({
  ticketId: true,
  societyId: true,
  reportedBy: true,
  status: true,
  assignedTo: true,
  attachments: true,
  timeline: true,
  createdAt: true,
  updatedAt: true,
});

export const updateHelpdeskTicketSchema = z.object({
  category: ticketCategorySchema.optional(),
  subject: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  status: ticketStatusSchema.optional(),
  assignedTo: z.string().optional(),
  attachments: z.array(z.string()).optional(),
});

export const addHelpdeskTimelineEntrySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});
