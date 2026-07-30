import z from "zod";
import {
  familyMemberSchema,
  addFamilyMemberSchema,
  updateFamilyMemberSchema,
} from "./family-member.schema";
import { ApiResponse } from "../shared/api.type";

export type FamilyMemberData = z.infer<typeof familyMemberSchema>;
export type AddFamilyMemberInput = z.infer<typeof addFamilyMemberSchema>;
export type UpdateFamilyMemberInput = z.infer<typeof updateFamilyMemberSchema>;
export type FamilyMemberResponse = ApiResponse<FamilyMemberData>;
export type FamilyMemberListResponse = ApiResponse<FamilyMemberData[]>;
