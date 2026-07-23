import z from "zod";

export const NOTICE_RECIPIENTS = ["guard", "residents"] as const;
const noticeRecipientEnum = z.enum(NOTICE_RECIPIENTS);
export const noticeRecipientSchema = z.array(noticeRecipientEnum).min(1, "Select at least one recipient");

export const NOTICE_STATUSES = ["draft", "published"] as const;
export const noticeStatusSchema = z.enum(NOTICE_STATUSES);

export const noticeSchema = z.object({
  noticeId: z.string().min(1),
  societyId: z.string().min(1),
  towerIds: z.array(z.string()).optional(),
  recipient: noticeRecipientSchema,
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  attachments: z.array(z.string()).optional(),
  status: noticeStatusSchema.default("draft"),
  createdBy: z.string().min(1),
  createdAt: z.string().optional(),
  publishedOn: z.string().optional(),
});

export const createNoticeSchema = noticeSchema.omit({
  noticeId: true,
  societyId: true,
  createdBy: true,
  createdAt: true,
  publishedOn: true,
});

export const updateNoticeSchema = createNoticeSchema.partial();
