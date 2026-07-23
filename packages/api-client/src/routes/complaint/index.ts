import { apiClient } from "../../services/axios-instance";
import { CreateComplaintBody, UpdateComplaintBody, AddTimelineEntryBody, ComplaintListResponse, ComplaintData, ComplaintFilterOptions } from "@repo/schema";
import { complaintQueries } from "../../react-queries/complaint";

export const createComplaint = async (data: CreateComplaintBody): Promise<ComplaintData> => {
  const res = await apiClient.post(complaintQueries.create.endpoint, data);
  return res.data.data;
};

export const getComplaints = async (params?: ComplaintFilterOptions): Promise<ComplaintListResponse["data"]> => {
  const res = await apiClient.get(complaintQueries.list.endpoint, { params });
  return res.data.data;
};

export const getComplaintDetail = async (id: string): Promise<ComplaintData> => {
  const res = await apiClient.get(complaintQueries.detail(id).endpoint);
  return res.data.data;
};

export const updateComplaint = async (id: string, data: UpdateComplaintBody): Promise<ComplaintData> => {
  const res = await apiClient.patch(complaintQueries.update(id).endpoint, data);
  return res.data.data;
};

export const deleteComplaint = async (id: string): Promise<boolean> => {
  const res = await apiClient.delete(complaintQueries.delete(id).endpoint);
  return res.data.success;
};

export const addComplaintTimelineEntry = async (id: string, data: AddTimelineEntryBody): Promise<ComplaintData> => {
  const res = await apiClient.post(complaintQueries.addTimeline(id).endpoint, data);
  return res.data.data;
};
