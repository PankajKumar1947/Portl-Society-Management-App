import {
  CreateResidentBody,
  ResidentResponse,
  ResidentListResponse,
  UpdateResidentBody,
  ApiResponse,
  ResidentPersonalInput,
  ResidentAllotmentInput,
  ResidentVehicleInput,
} from "@repo/schema";
import { residentQueries } from "../../react-queries/resident";
import { apiClient } from "../../services/axios-instance";

export const createResident = async (data: CreateResidentBody): Promise<ResidentResponse> => {
  const res = await apiClient.post<ResidentResponse>(residentQueries.create.endpoint, data);
  return res.data;
};

export const getResidents = async (
  societyId?: string,
  type?: string,
  search?: string
): Promise<ResidentListResponse> => {
  const res = await apiClient.get<ResidentListResponse>(
    residentQueries.list(societyId).endpoint,
    {
      params: { societyId, type, search },
    }
  );
  return res.data;
};

export const getResidentDetails = async (residentId: string): Promise<ResidentResponse> => {
  const res = await apiClient.get<ResidentResponse>(residentQueries.details(residentId).endpoint);
  return res.data;
};

export const updateResident = async (
  residentId: string,
  data: UpdateResidentBody
): Promise<ResidentResponse> => {
  const res = await apiClient.patch<ResidentResponse>(
    residentQueries.update(residentId).endpoint,
    data
  );
  return res.data;
};

export const deleteResident = async (residentId: string): Promise<ApiResponse<null>> => {
  const res = await apiClient.delete<ApiResponse<null>>(residentQueries.delete(residentId).endpoint);
  return res.data;
};

export const onboardResidentPersonal = async (
  data: ResidentPersonalInput
): Promise<ApiResponse<{ userId: string; email: string }>> => {
  const res = await apiClient.post<ApiResponse<{ userId: string; email: string }>>(
    residentQueries.onboardPersonal.endpoint,
    data
  );
  return res.data;
};

export const onboardResidentAllotment = async (
  data: ResidentAllotmentInput
): Promise<ResidentResponse> => {
  const res = await apiClient.post<ResidentResponse>(
    residentQueries.onboardAllotment.endpoint,
    data
  );
  return res.data;
};

export const onboardResidentVehicle = async (
  residentId: string,
  data: ResidentVehicleInput
): Promise<ResidentResponse> => {
  const res = await apiClient.patch<ResidentResponse>(
    residentQueries.onboardVehicle(residentId).endpoint,
    data
  );
  return res.data;
};
