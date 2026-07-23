import {
  GuardPersonalInput,
  GuardDutyInput,
  GuardIdentificationInput,
  UpdateGuardBody,
  GuardResponse,
  GuardListResponse,
  GuardDetailResponse,
  GuardDeleteResponse,
} from "@repo/schema";
import { guardQueries } from "../../react-queries/guard";
import { apiClient } from "../../services/axios-instance";

export const onboardGuardPersonal = async (
  data: GuardPersonalInput
): Promise<{ userId: string; email: string }> => {
  const res = await apiClient.post(guardQueries.onboardPersonal.endpoint, data);
  return res.data;
};

export const onboardGuardIdentity = async (
  data: GuardIdentificationInput & { userId: string }
): Promise<GuardResponse> => {
  const res = await apiClient.post(guardQueries.onboardIdentity.endpoint, data);
  return res.data;
};

export const onboardGuardDuty = async (
  data: GuardDutyInput
): Promise<GuardResponse> => {
  const res = await apiClient.post(guardQueries.onboardDuty.endpoint, data);
  return res.data;
};

export const getGuards = async (params?: { type?: string; search?: string }): Promise<GuardListResponse> => {
  const res = await apiClient.get(guardQueries.getGuards.endpoint, { params });
  return res.data;
};

export const getGuardDetails = async (guardId: string): Promise<GuardDetailResponse> => {
  const res = await apiClient.get(guardQueries.getGuardDetail(guardId).endpoint);
  return res.data;
};

export const updateGuard = async (guardId: string, data: UpdateGuardBody): Promise<GuardResponse> => {
  const res = await apiClient.patch(guardQueries.update(guardId).endpoint, data);
  return res.data;
};

export const deleteGuard = async (guardId: string): Promise<GuardDeleteResponse> => {
  const res = await apiClient.delete(guardQueries.delete(guardId).endpoint);
  return res.data;
};
