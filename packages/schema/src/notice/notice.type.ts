import z from "zod";
import {
  noticeSchema,
  createNoticeSchema,
  updateNoticeSchema,
} from "./notice.schema";
import { ApiResponse } from "../shared/api.type";
import { User } from "../user/user.type";

export type NoticeData = z.infer<typeof noticeSchema> & {
  publisher?: User;
};

export type CreateNoticeBody = z.infer<typeof createNoticeSchema>;
export type UpdateNoticeBody = z.infer<typeof updateNoticeSchema>;
export type NoticeResponse = ApiResponse<NoticeData>;
export type NoticeListResponse = ApiResponse<NoticeData[]>;
