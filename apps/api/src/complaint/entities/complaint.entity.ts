import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { COMPLAINT_STATUSES, COMPLAINT_STATUS, COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES, COMPLAINT_PRIORITY } from "@repo/schema";
import * as crypto from "crypto";

export type ComplaintDocument = HydratedDocument<Complaint>;

export class TimelineEntry {
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

@Schema({ timestamps: true, collection: "complaints" })
export class Complaint {
  @Prop({
    required: true,
    unique: true,
    default: () => `cmp_${crypto.randomBytes(10).toString("hex")}`,
  })
  complaintId: string;

  @Prop({ required: true, index: true })
  societyId: string;

  @Prop({ required: true, type: String, enum: COMPLAINT_CATEGORIES })
  category: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: String, enum: COMPLAINT_STATUSES, default: COMPLAINT_STATUS.PENDING })
  status: string;

  @Prop({ required: true, type: String, enum: COMPLAINT_PRIORITIES, default: COMPLAINT_PRIORITY.MEDIUM })
  priority: string;

  @Prop({ required: true, index: true })
  reportedBy: string;

  @Prop()
  assignedTo?: string;

  @Prop({ type: [String], default: [] })
  towerIds: string[];

  @Prop()
  flatId?: string;

  @Prop()
  unitNumber?: string;

  @Prop({ type: [String], default: [] })
  attachments: string[];

  @Prop({ type: [TimelineEntry], default: [] })
  timeline: TimelineEntry[];
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);

ComplaintSchema.virtual("reportedByUser", {
  ref: "User",
  localField: "reportedBy",
  foreignField: "userId",
  justOne: true,
});

ComplaintSchema.virtual("assignedToUser", {
  ref: "User",
  localField: "assignedTo",
  foreignField: "userId",
  justOne: true,
});

ComplaintSchema.virtual("attachmentFiles", {
  ref: "Media",
  localField: "attachments",
  foreignField: "_id",
});

ComplaintSchema.set("toJSON", { virtuals: true });
ComplaintSchema.set("toObject", { virtuals: true });
