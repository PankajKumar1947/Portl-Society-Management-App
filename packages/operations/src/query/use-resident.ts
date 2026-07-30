import { useQuery } from "@tanstack/react-query";
import {
  getResidents,
  getResidentDetails,
  getMyResident,
  getMyVehicles,
  getVehicleDetail,
  residentQueries,
} from "@repo/api-client";
import { ResidentListResponse, ResidentResponse, ApiResponse, Vehicle } from "@repo/schema";

export const useGetResidents = (
  societyId?: string,
  params?: { type?: string; search?: string; enabled?: boolean }
) => {
  const { type, search, enabled = true } = params || {};
  return useQuery({
    queryKey: [...residentQueries.list(societyId).key, type, search],
    queryFn: () => getResidents(societyId, type, search),
    select: (response: ResidentListResponse) => response.data,
    enabled: enabled,
  });
};

export const useGetResidentDetail = (
  residentId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: residentQueries.details(residentId).key,
    queryFn: () => getResidentDetails(residentId),
    select: (response: ResidentResponse) => response.data,
    enabled: !!residentId && options?.enabled,
  });
};

export const useGetMyResident = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: residentQueries.myResident.key,
    queryFn: getMyResident,
    select: (response: ResidentResponse) => response.data,
    enabled: options?.enabled ?? true,
  });
};

export const useGetMyVehicles = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: residentQueries.getVehicles.key,
    queryFn: getMyVehicles,
    select: (response: ApiResponse<Vehicle[]>) => response.data,
    enabled: options?.enabled ?? true,
  });
};

export const useGetVehicleDetail = (vehicleId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: residentQueries.getVehicleDetail(vehicleId).key,
    queryFn: () => getVehicleDetail(vehicleId),
    select: (response: ApiResponse<Vehicle>) => response.data,
    enabled: !!vehicleId && (options?.enabled ?? true),
  });
};
