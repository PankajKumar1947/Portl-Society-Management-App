import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { TICKET_STATUSES, TICKET_STATUS, TICKET_CATEGORIES } from "@repo/schema";
import * as crypto from "crypto";

export type HelpdeskTicketDocument = HydratedDocument<HelpdeskTicket>;

export class HelpdeskTimelineEntry {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  updatedBy: string;

  @Prop({ default: () => new Date().toISOString() })
  createdAt: string;
}

@Schema({ timestamps: true, collection: "helpdesk_tickets" })
export class HelpdeskTicket {
  @Prop({
    required: true,
    unique: true,
    default: () => `tkt_${crypto.randomBytes(10).toString("hex")}`,
  })
  ticketId: string;

  @Prop({ required: true, index: true })
  societyId: string;

  @Prop({ required: true, type: String, enum: TICKET_CATEGORIES })
  category: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: String, enum: TICKET_STATUSES, default: TICKET_STATUS.OPEN })
  status: string;

  @Prop({ required: true, index: true })
  reportedBy: string;

  @Prop()
  assignedTo?: string;

  @Prop({ type: [String], default: [] })
  attachments: string[];

  @Prop({ type: [HelpdeskTimelineEntry], default: [] })
  timeline: HelpdeskTimelineEntry[];
}

export const HelpdeskTicketSchema = SchemaFactory.createForClass(HelpdeskTicket);

HelpdeskTicketSchema.set("toJSON", { virtuals: true });
HelpdeskTicketSchema.set("toObject", { virtuals: true });
