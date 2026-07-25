import z from "zod";
import {
  visitorSchema,
  createVisitorSchema,
  updateVisitorSchema,
} from "./visitor.schema";
import { ApiResponse } from "../shared/api.type";
import { User } from "../user/user.type";
import { Flat } from "../flat/flat.type";

export type VisitorData = z.infer<typeof visitorSchema> & {
  resident?: User;
  flat?: Flat;
};

export type CreateVisitorBody = z.infer<typeof createVisitorSchema>;

export interface CreateVisitorForm {
  type: CreateVisitorBody["type"];
  name: string;
  mobile: string;
  purpose: string;
  visitDate?: Date;
  visitTime?: Date;
  towerId: string;
  flatId: string;
}
export type UpdateVisitorBody = z.infer<typeof updateVisitorSchema>;
export type VisitorResponse = ApiResponse<VisitorData>;
export type VisitorListResponse = ApiResponse<VisitorData[]>;
