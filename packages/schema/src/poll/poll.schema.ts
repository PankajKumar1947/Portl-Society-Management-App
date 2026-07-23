import z from "zod";

export const POLL_STATUSES = ["draft", "published", "closed"] as const;
export const pollStatusSchema = z.enum(POLL_STATUSES);

export const POLL_RECIPIENTS = ["guard", "residents"] as const;
const pollRecipientEnum = z.enum(POLL_RECIPIENTS);
export const pollRecipientSchema = z.array(pollRecipientEnum).min(1, "Select at least one recipient");

export const POLL_CHOICE_TYPES = ["single", "multi"] as const;
export const pollChoiceTypeSchema = z.enum(POLL_CHOICE_TYPES);

export const pollOptionSchema = z.object({
  optionId: z.string().min(1),
  pollId: z.string().min(1),
  label: z.string().min(1, "Option label is required"),
  displayOrder: z.number().nonnegative().default(0),
});

export const createPollOptionSchema = pollOptionSchema.omit({
  optionId: true,
  pollId: true,
});

export const pollSchema = z.object({
  pollId: z.string().min(1),
  societyId: z.string().min(1),
  towerIds: z.array(z.string()).optional(),
  recipient: pollRecipientSchema,
  question: z.string().min(1, "Question is required"),
  description: z.string().optional(),
  choiceType: pollChoiceTypeSchema.default("single"),
  status: pollStatusSchema.default("draft"),
  createdBy: z.string().min(1),
  expiresAt: z.string().min(1, "Expiry date is required"),
  publishedOn: z.string().optional(),
  closedOn: z.string().optional(),
  createdAt: z.string().optional(),
});

export const createPollSchema = pollSchema.omit({
  pollId: true,
  societyId: true,
  createdBy: true,
  publishedOn: true,
  closedOn: true,
  createdAt: true,
}).extend({
  options: z.array(createPollOptionSchema).min(2, "At least 2 options are required"),
});

export const updatePollSchema = createPollSchema.partial();
