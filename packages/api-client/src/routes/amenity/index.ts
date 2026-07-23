import { apiClient } from "../../services/axios-instance";
import { CreateAmenityBody, UpdateAmenityBody, AmenityData, AmenityFilterOptions } from "@repo/schema";
import { amenityQueries } from "../../react-queries/amenity";

export const createAmenity = async (data: CreateAmenityBody): Promise<AmenityData> => {
  const res = await apiClient.post(amenityQueries.create.endpoint, data);
  return res.data.data;
};

export const getAmenities = async (params?: AmenityFilterOptions): Promise<AmenityData[]> => {
  const res = await apiClient.get(amenityQueries.list.endpoint, { params });
  return res.data.data;
};

export const getAmenityDetail = async (id: string): Promise<AmenityData> => {
  const query = amenityQueries.detail(id);
  const res = await apiClient.get(query.endpoint);
  return res.data.data;
};

export const updateAmenity = async (id: string, data: UpdateAmenityBody): Promise<AmenityData> => {
  const query = amenityQueries.update(id);
  const res = await apiClient.patch(query.endpoint, data);
  return res.data.data;
};

export const deleteAmenity = async (id: string): Promise<boolean> => {
  const query = amenityQueries.delete(id);
  const res = await apiClient.delete(query.endpoint);
  return res.data.success;
};
