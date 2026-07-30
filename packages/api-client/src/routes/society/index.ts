import { CreateSocietyBody, CreateSocietyData, Society, UpdateSocietyBody, SocietyStats } from "@repo/schema";
import { societyQueries } from "../../react-queries/society";
import { apiClient } from "../../services/axios-instance";

export const createSociety = async (
  data: CreateSocietyBody,
): Promise<CreateSocietyData> => {
  const res = await apiClient.post(societyQueries.create.endpoint, data);
  return res.data;
};

export const getMySociety = async (): Promise<Society> => {
  const res = await apiClient.get(societyQueries.me.endpoint);
  return res.data;
};

export const getSocietyDetails = async (societyId: string): Promise<Society> => {
  const res = await apiClient.get(societyQueries.details(societyId).endpoint);
  return res.data;
};

export const updateSociety = async (
  societyId: string,
  data: UpdateSocietyBody,
): Promise<Society> => {
  const res = await apiClient.patch(societyQueries.update(societyId).endpoint, data);
  return res.data;
};

export const getSocietyStats = async (): Promise<SocietyStats> => {
  const res = await apiClient.get<SocietyStats>(societyQueries.stats.endpoint);
  return res.data;
};
