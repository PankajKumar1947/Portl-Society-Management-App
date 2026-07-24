import z from "zod";
import {
  familyMemberSchema,
  addFamilyMemberSchema,
} from "./family-member.schema";
import { ApiResponse } from "../shared/api.type";

export type FamilyMemberData = z.infer<typeof familyMemberSchema>;
export type AddFamilyMemberInput = z.infer<typeof addFamilyMemberSchema>;
export type FamilyMemberResponse = ApiResponse<FamilyMemberData>;
export type FamilyMemberListResponse = ApiResponse<FamilyMemberData[]>;
