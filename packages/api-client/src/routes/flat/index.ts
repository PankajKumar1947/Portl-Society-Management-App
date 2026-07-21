import { CreateFlatBody, Flat, UpdateFlatBody } from "@repo/schema";
import { flatQueries } from "../../react-queries/flat";
import { apiClient } from "../../services/axios-instance";

export const createFlat = async (data: CreateFlatBody): Promise<Flat> => {
  const res = await apiClient.post(flatQueries.create.endpoint, data);
  return res.data;
};

export const getFlats = async (towerId: string): Promise<Flat[]> => {
  const res = await apiClient.get(flatQueries.list(towerId).endpoint);
  return res.data;
};

export const getFlatDetails = async (flatId: string): Promise<Flat> => {
  const res = await apiClient.get(flatQueries.details(flatId).endpoint);
  return res.data;
};

export const updateFlat = async (
  flatId: string,
  data: UpdateFlatBody,
): Promise<Flat> => {
  const res = await apiClient.patch(flatQueries.update(flatId).endpoint, data);
  return res.data;
};

export const deleteFlat = async (flatId: string): Promise<{ message: string }> => {
  const res = await apiClient.delete(flatQueries.delete(flatId).endpoint);
  return res.data;
};
