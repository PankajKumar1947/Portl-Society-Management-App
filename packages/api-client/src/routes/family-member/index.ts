import {
  AddFamilyMemberInput,
  FamilyMemberResponse,
  FamilyMemberListResponse,
} from "@repo/schema";
import { familyMemberQueries } from "../../react-queries/family-member";
import { apiClient } from "../../services/axios-instance";

export const getFamilyMembers = async (): Promise<FamilyMemberListResponse> => {
  const res = await apiClient.get<FamilyMemberListResponse>(familyMemberQueries.list.endpoint);
  return res.data;
};

export const addFamilyMember = async (
  data: AddFamilyMemberInput
): Promise<FamilyMemberResponse> => {
  const res = await apiClient.post<FamilyMemberResponse>(familyMemberQueries.add.endpoint, data);
  return res.data;
};
