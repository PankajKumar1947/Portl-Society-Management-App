import { ApiResponse } from "../shared/api.type";
import z from "zod";
import {
  helpdeskTicketSchema,
  createHelpdeskTicketSchema,
  updateHelpdeskTicketSchema,
  helpdeskTimelineEntrySchema,
  addHelpdeskTimelineEntrySchema,
} from "./helpdesk-ticket.schema";

export type TicketStatus = z.infer<typeof helpdeskTicketSchema.shape.status>;
export type TicketCategory = z.infer<typeof helpdeskTicketSchema.shape.category>;

export type HelpdeskTimelineEntryData = z.infer<typeof helpdeskTimelineEntrySchema>;

export type HelpdeskTicketData = z.infer<typeof helpdeskTicketSchema>;

export type CreateHelpdeskTicketBody = z.infer<typeof createHelpdeskTicketSchema>;
export type UpdateHelpdeskTicketBody = z.infer<typeof updateHelpdeskTicketSchema>;
export type AddHelpdeskTimelineEntryBody = z.infer<typeof addHelpdeskTimelineEntrySchema>;

export type HelpdeskTicketResponse = ApiResponse<HelpdeskTicketData>;
export type HelpdeskTicketListResponse = ApiResponse<HelpdeskTicketData[]>;

export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

export const TICKET_STATUS_VARIANT: Record<TicketStatus, "warning" | "info" | "success" | "danger"> = {
  OPEN: "warning",
  IN_PROGRESS: "info",
  RESOLVED: "success",
  REJECTED: "danger",
};

export const TICKET_CATEGORY_LABEL: Record<TicketCategory, string> = {
  MAINTENANCE: "Maintenance",
  PLUMBING: "Plumbing",
  ELECTRICAL: "Electrical",
  SECURITY: "Security",
  HOUSEKEEPING: "Housekeeping",
  OTHER: "Other",
};

export interface HelpdeskTicketFilterOptions {
  search?: string;
  status?: string;
  category?: string;
  userId?: string;
}
