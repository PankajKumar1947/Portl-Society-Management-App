import z from "zod";
import {
  visitorProfileSchema,
  visitorLogSchema,
  createVisitorSchema,
  updateVisitorLogSchema,
  updateVisitorStatusSchema,
  visitorLogEntrySchema,
  SCAN_DIRECTIONS,
} from "./visitor.schema";
import { ApiResponse } from "../shared/api.type";
import { User } from "../user/user.type";
import { Flat } from "../flat/flat.type";

export type VisitorProfileData = z.infer<typeof visitorProfileSchema>;

export type VisitorLogEntry = z.infer<typeof visitorLogEntrySchema>;

export type VisitorLogData = z.infer<typeof visitorLogSchema> & {
  visitor?: VisitorProfileData;
  resident?: User;
  flat?: Flat;
};

export type CreateVisitorBody = z.infer<typeof createVisitorSchema>;

export type UpdateVisitorLogBody = z.infer<typeof updateVisitorLogSchema>;

export type UpdatableVisitorStatus = z.infer<typeof updateVisitorStatusSchema>["status"];

export type ScanDirection = (typeof SCAN_DIRECTIONS)[number];

export interface CreateVisitorForm {
  type: CreateVisitorBody["type"];
  name: string;
  mobile: string;
  purpose?: string;
  validFrom?: Date;
  validTo?: Date;
  towerId: string;
  flatId: string;
}

export type VisitorResponse = ApiResponse<VisitorLogData>;
export type VisitorListResponse = ApiResponse<VisitorLogData[]>;
