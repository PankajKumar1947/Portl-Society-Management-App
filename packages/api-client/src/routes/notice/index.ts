import {
  CreateNoticeBody,
  UpdateNoticeBody,
  NoticeResponse,
  NoticeListResponse,
} from "@repo/schema";
import { noticeQueries } from "../../react-queries/notice";
import { apiClient } from "../../services/axios-instance";

export const getNotices = async (params?: { search?: string; status?: string; recipient?: string }): Promise<NoticeListResponse> => {
  const res = await apiClient.get(noticeQueries.getNotices.endpoint, { params });
  return res.data;
};

export const getNoticeDetails = async (noticeId: string): Promise<NoticeResponse> => {
  const res = await apiClient.get(noticeQueries.getNoticeDetail(noticeId).endpoint);
  return res.data;
};

export const createNotice = async (data: CreateNoticeBody): Promise<NoticeResponse> => {
  const res = await apiClient.post(noticeQueries.create.endpoint, data);
  return res.data;
};

export const updateNotice = async (noticeId: string, data: UpdateNoticeBody): Promise<NoticeResponse> => {
  const res = await apiClient.patch(noticeQueries.update(noticeId).endpoint, data);
  return res.data;
};

export const deleteNotice = async (noticeId: string): Promise<void> => {
  await apiClient.delete(noticeQueries.delete(noticeId).endpoint);
};

export const publishNotice = async (noticeId: string): Promise<NoticeResponse> => {
  const res = await apiClient.post(noticeQueries.publish(noticeId).endpoint);
  return res.data;
};
