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
  guardIdentificationSchema,
  policeVerificationStatusSchema,
  dutyFormSchema,
} from "./guard.schema";
import { ApiResponse } from "../shared/api.type";
import { User } from "../user/user.type";

export type ShiftType = z.infer<typeof shiftTypeSchema>;
export type GuardStatus = z.infer<typeof guardStatusSchema>;
export type PoliceVerificationStatus = z.infer<typeof policeVerificationStatusSchema>;
export type DutyFormValues = z.infer<typeof dutyFormSchema>;

export type GuardData = z.infer<typeof guardSchema> & {
  userDetails?: User;
};

export type CreateGuardBody = z.infer<typeof createGuardSchema>;
export type UpdateGuardBody = z.infer<typeof updateGuardSchema>;
export type GuardFormValues = z.infer<typeof guardFormSchema>;
export type GuardPersonalInput = z.infer<typeof guardPersonalSchema>;
export type GuardIdentificationInput = z.infer<typeof guardIdentificationSchema>;
export type GuardDutyInput = z.infer<typeof guardDutySchema>;
export type GuardResponse = ApiResponse<GuardData>;
export type GuardListResponse = ApiResponse<GuardData[]>;
export type GuardDetailResponse = ApiResponse<GuardData>;
export type GuardDeleteResponse = ApiResponse<{ message: string }>;
