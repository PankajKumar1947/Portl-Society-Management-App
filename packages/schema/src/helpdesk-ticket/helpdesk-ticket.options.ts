import { TICKET_STATUS_LABEL, TICKET_CATEGORY_LABEL } from "./helpdesk-ticket.type";
import { TICKET_STATUSES, TICKET_CATEGORIES } from "./helpdesk-ticket.schema";
import { TicketStatus, TicketCategory } from "./helpdesk-ticket.type";

export const CATEGORY_OPTIONS = (Object.entries(TICKET_CATEGORY_LABEL) as [TicketCategory, string][]).map(
  ([value, label]) => ({ label, value }),
);

export const STATUS_FILTER_OPTIONS = [
  { label: "All", value: "all" },
  ...TICKET_STATUSES.map((s) => ({
    label: TICKET_STATUS_LABEL[s as TicketStatus] || s,
    value: s,
  })),
];

export const CATEGORY_FILTER_OPTIONS = [
  { label: "All", value: "all" },
  ...TICKET_CATEGORIES.map((c) => ({
    label: TICKET_CATEGORY_LABEL[c as TicketCategory] || c,
    value: c,
  })),
];
