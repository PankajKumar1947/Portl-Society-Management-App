import z from "zod";

export const COMPLAINT_STATUSES = ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"] as const;
export const COMPLAINT_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  REJECTED: "REJECTED",
} as const;
export const complaintStatusSchema = z.enum(COMPLAINT_STATUSES);

export const COMPLAINT_CATEGORIES = [
  "NOISY_NEIGHBOR",
  "SECURITY",
  "HOUSEKEEPING",
  "BUILDER_DEFECT",
  "OTHER",
] as const;
export const complaintCategorySchema = z.enum(COMPLAINT_CATEGORIES);

export const COMPLAINT_PRIORITIES = ["low", "medium", "high"] as const;
export const COMPLAINT_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;
export const complaintPrioritySchema = z.enum(COMPLAINT_PRIORITIES);

export const timelineEntrySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.string().min(1),
  updatedBy: z.string().min(1),
  createdAt: z.string().optional(),
});

export const createTimelineEntrySchema = timelineEntrySchema.omit({
  createdAt: true,
});

export const complaintSchema = z.object({
  complaintId: z.string().min(1),
  societyId: z.string().min(1),
  category: complaintCategorySchema,
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(1, "Description is required"),
  status: complaintStatusSchema.default("PENDING"),
  priority: complaintPrioritySchema.default(COMPLAINT_PRIORITY.MEDIUM),
  reportedBy: z.string().min(1),
  assignedTo: z.string().optional(),
  towerIds: z.array(z.string()).optional(),
  flatId: z.string().optional(),
  unitNumber: z.string().optional(),
  attachments: z.array(z.string()).default([]),
  timeline: z.array(timelineEntrySchema).default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const createComplaintSchema = complaintSchema.omit({
  complaintId: true,
  societyId: true,
  reportedBy: true,
  status: true,
  priority: true,
  assignedTo: true,
  attachments: true,
  timeline: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  priority: complaintPrioritySchema.default(COMPLAINT_PRIORITY.MEDIUM),
});

export const updateComplaintSchema = z.object({
  category: complaintCategorySchema.optional(),
  subject: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  status: complaintStatusSchema.optional(),
  priority: complaintPrioritySchema.optional(),
  assignedTo: z.string().optional(),
  towerIds: z.array(z.string()).optional(),
  flatId: z.string().optional(),
  unitNumber: z.string().optional(),
  attachments: z.array(z.string()).optional(),
});

export const addTimelineEntrySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});
