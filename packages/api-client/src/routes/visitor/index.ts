import {
  CreateVisitorBody,
  UpdateVisitorBody,
  VisitorResponse,
  VisitorListResponse,
} from "@repo/schema";
import { visitorQueries } from "../../react-queries/visitor";
import { apiClient } from "../../services/axios-instance";

export const getVisitors = async (params?: { status?: string; type?: string }): Promise<VisitorListResponse> => {
  const res = await apiClient.get(visitorQueries.getVisitors.endpoint, { params });
  return res.data;
};

export const getVisitorDetails = async (visitorId: string): Promise<VisitorResponse> => {
  const res = await apiClient.get(visitorQueries.getVisitorDetail(visitorId).endpoint);
  return res.data;
};

export const createVisitor = async (data: CreateVisitorBody): Promise<VisitorResponse> => {
  const res = await apiClient.post(visitorQueries.create.endpoint, data);
  return res.data;
};

export const updateVisitorStatus = async (
  visitorId: string,
  status: 'approved' | 'rejected' | 'completed',
): Promise<VisitorResponse> => {
  const res = await apiClient.patch(visitorQueries.updateStatus(visitorId).endpoint, { status });
  return res.data;
};

export const verifyPassCode = async (passCode: string): Promise<VisitorResponse> => {
  const res = await apiClient.get(visitorQueries.verifyPassCode(passCode).endpoint);
  return res.data;
};
