import { useQuery } from "@tanstack/react-query";
import { getNotices, getNoticeDetails, noticeQueries } from "@repo/api-client";
import { NoticeListResponse, NoticeResponse, NoticeData } from "@repo/schema";

export const useGetNotices = (query?: { search?: string; status?: string; recipient?: string }) => {
  return useQuery({
    queryKey: [...noticeQueries.getNotices.key, query],
    queryFn: () => getNotices(query),
    select: (response: NoticeListResponse): NoticeData[] => response.data,
  });
};

export const useGetNoticeDetail = (noticeId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: noticeQueries.getNoticeDetail(noticeId).key,
    queryFn: () => getNoticeDetails(noticeId),
    select: (response: NoticeResponse): NoticeData => response.data,
    enabled: options?.enabled ?? !!noticeId,
  });
};
