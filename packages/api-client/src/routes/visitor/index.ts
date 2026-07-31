import {
  CreateVisitorBody,
  VisitorResponse,
  VisitorListResponse,
} from "@repo/schema";
import { visitorQueries } from "../../react-queries/visitor";
import { apiClient } from "../../services/axios-instance";

export const getVisitors = async (params?: { status?: string; type?: string }): Promise<VisitorListResponse> => {
  const res = await apiClient.get(visitorQueries.getVisitors.endpoint, { params });
  return res.data;
};

export const getVisitorDetails = async (logId: string): Promise<VisitorResponse> => {
  const res = await apiClient.get(visitorQueries.getVisitorDetail(logId).endpoint);
  return res.data;
};

export const getVisitorVisits = async (logId: string): Promise<VisitorListResponse> => {
  const res = await apiClient.get(visitorQueries.getVisitorVisits(logId).endpoint);
  return res.data;
};

export const getVisitorLogs = async (params?: { search?: string; dateFrom?: string; dateTo?: string; direction?: string }): Promise<VisitorListResponse> => {
  const res = await apiClient.get(visitorQueries.getVisitorLogs.endpoint, { params });
  return res.data;
};

export const createVisitor = async (data: CreateVisitorBody): Promise<VisitorResponse> => {
  const res = await apiClient.post(visitorQueries.create.endpoint, data);
  return res.data;
};

export const updateVisitorStatus = async (
  logId: string,
  status: 'pending' | 'approved' | 'rejected' | 'completed',
): Promise<VisitorResponse> => {
  const res = await apiClient.patch(visitorQueries.updateStatus(logId).endpoint, { status });
  return res.data;
};

export const scanPassCode = async (params: { passCode: string; type: 'entry' | 'exit' }): Promise<VisitorResponse> => {
  const res = await apiClient.patch(visitorQueries.scanPassCode(params.passCode).endpoint, null, { params: { type: params.type } });
  return res.data;
};

export const requestEntry = async (data: { mobile: string; name?: string; type?: string; purpose?: string; flatId?: string }): Promise<VisitorResponse> => {
  const res = await apiClient.post(visitorQueries.requestEntry.endpoint, data);
  return res.data;
};
