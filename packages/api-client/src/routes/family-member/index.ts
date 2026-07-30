import {
  AddFamilyMemberInput,
  UpdateFamilyMemberInput,
  FamilyMemberResponse,
  FamilyMemberListResponse,
} from "@repo/schema";
import { familyMemberQueries } from "../../react-queries/family-member";
import { apiClient } from "../../services/axios-instance";

export const getFamilyMembers = async (): Promise<FamilyMemberListResponse> => {
  const res = await apiClient.get<FamilyMemberListResponse>(familyMemberQueries.list.endpoint);
  return res.data;
};

export const getFamilyMember = async (id: string): Promise<FamilyMemberResponse> => {
  const res = await apiClient.get<FamilyMemberResponse>(familyMemberQueries.detail(id).endpoint);
  return res.data;
};

export const addFamilyMember = async (
  data: AddFamilyMemberInput
): Promise<FamilyMemberResponse> => {
  const res = await apiClient.post<FamilyMemberResponse>(familyMemberQueries.add.endpoint, data);
  return res.data;
};

export const updateFamilyMember = async (
  id: string,
  data: UpdateFamilyMemberInput
): Promise<FamilyMemberResponse> => {
  const res = await apiClient.patch<FamilyMemberResponse>(familyMemberQueries.update(id).endpoint, data);
  return res.data;
};

export const deleteFamilyMember = async (id: string): Promise<void> => {
  await apiClient.delete(familyMemberQueries.delete(id).endpoint);
};
