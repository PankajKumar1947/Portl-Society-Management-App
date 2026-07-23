import z from "zod";
import {
  complaintSchema,
  createComplaintSchema,
  updateComplaintSchema,
  timelineEntrySchema,
  createTimelineEntrySchema,
  addTimelineEntrySchema,
  complaintCategorySchema,
  complaintPrioritySchema,
} from "./complaint.schema";
import { ApiResponse } from "../shared/api.type";
import { MediaData } from "../media/media.type";
import { User } from "../user/user.type";

export type ComplaintCategory = z.infer<typeof complaintCategorySchema>;
export type ComplaintPriority = z.infer<typeof complaintPrioritySchema>;

export type TimelineEntryData = z.infer<typeof timelineEntrySchema>;
export type CreateTimelineEntryBody = z.infer<typeof createTimelineEntrySchema>;
export type AddTimelineEntryBody = z.infer<typeof addTimelineEntrySchema>;

export type ComplaintData = z.infer<typeof complaintSchema> & {
  reportedByUser?: User;
  assignedToUser?: User;
  attachmentFiles?: MediaData[];
};

export type CreateComplaintBody = z.infer<typeof createComplaintSchema>;
export type UpdateComplaintBody = z.infer<typeof updateComplaintSchema>;

export type ComplaintResponse = ApiResponse<ComplaintData>;
export type ComplaintListResponse = ApiResponse<ComplaintData[]>;

export interface ComplaintFilterOptions {
  search?: string;
  status?: string;
  category?: string;
  userId?: string;
}
