import z from "zod";
import {
  guardSchema,
  createGuardSchema,
  updateGuardSchema,
  guardFormSchema,
  shiftTypeSchema,
  guardStatusSchema,
  guardPersonalSchema,
  guardDutySchema,
} from "./guard.schema";
import { ApiResponse } from "../shared/api.type";
import { User } from "../user/user.type";

export type ShiftType = z.infer<typeof shiftTypeSchema>;
export type GuardStatus = z.infer<typeof guardStatusSchema>;

export type GuardData = z.infer<typeof guardSchema> & {
  userDetails?: User;
};

export type CreateGuardBody = z.infer<typeof createGuardSchema>;
export type UpdateGuardBody = z.infer<typeof updateGuardSchema>;
export type GuardFormValues = z.infer<typeof guardFormSchema>;
export type GuardPersonalInput = z.infer<typeof guardPersonalSchema>;
export type GuardDutyInput = z.infer<typeof guardDutySchema>;
export type GuardResponse = ApiResponse<GuardData>;
export type GuardListResponse = ApiResponse<GuardData[]>;
export type GuardDetailResponse = ApiResponse<GuardData>;
export type GuardDeleteResponse = ApiResponse<{ message: string }>;
export type GuardOptionsType = {
  SHIFT_TYPES: any;
};

export const SHIFT_TYPE_OPTIONS = [
  { label: "Day Shift (08:00 AM - 08:00 PM)", value: "DAY" },
  { label: "Night Shift (08:00 PM - 08:00 AM)", value: "NIGHT" },
  { label: "Routine Shift", value: "ROUTINE" },
];
export const GUARD_STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "On Leave", value: "ON_LEAVE" },
];
