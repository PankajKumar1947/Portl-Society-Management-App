import { CreateTowerBody, Tower, UpdateTowerBody } from "@repo/schema";
import { towerQueries } from "../../react-queries/tower";
import { apiClient } from "../../services/axios-instance";

export const createTower = async (data: CreateTowerBody): Promise<Tower> => {
  const res = await apiClient.post(towerQueries.create.endpoint, data);
  return res.data;
};

export const getTowers = async (societyId: string): Promise<Tower[]> => {
  const res = await apiClient.get(towerQueries.list(societyId).endpoint);
  return res.data;
};

export const getTowerDetails = async (towerId: string): Promise<Tower> => {
  const res = await apiClient.get(towerQueries.details(towerId).endpoint);
  return res.data;
};

export const updateTower = async (
  towerId: string,
  data: UpdateTowerBody,
): Promise<Tower> => {
  const res = await apiClient.patch(towerQueries.update(towerId).endpoint, data);
  return res.data;
};

export const deleteTower = async (towerId: string): Promise<{ message: string }> => {
  const res = await apiClient.delete(towerQueries.delete(towerId).endpoint);
  return res.data;
};
