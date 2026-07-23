import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { AmenityCategory, AmenityType, AmenityStatus } from "@repo/schema";
import * as crypto from "crypto";

@Schema({ _id: false })
export class OperatingHourEntity {
  @Prop({ required: true, min: 0, max: 6 })
  dayOfWeek: number;

  @Prop({ required: true })
  openTime: string;

  @Prop({ required: true })
  closeTime: string;

  @Prop({ required: true, default: false })
  isClosed: boolean;
}

export const OperatingHourSchema = SchemaFactory.createForClass(OperatingHourEntity);

@Schema({ timestamps: true, collection: "amenities" })
export class Amenity {
  @Prop({
    required: true,
    unique: true,
    default: () => `amn_${crypto.randomBytes(10).toString("hex")}`,
  })
  amenityId: string;

  @Prop({ required: true, index: true })
  societyId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true, type: String })
  category: AmenityCategory;

  @Prop({ required: true, type: String })
  type: AmenityType;

  @Prop({ type: [String], default: [] })
  towerIds: string[];

  @Prop()
  floorNumber?: string;

  @Prop()
  location?: string;

  @Prop()
  thumbnail?: string;

  @Prop({ type: [String], default: [] })
  gallery: string[];

  @Prop({ required: true, default: 50 })
  capacity: number;

  @Prop({ required: true, default: false })
  bookingRequired: boolean;

  @Prop()
  bookingDuration?: number;

  @Prop({ required: true, default: 0 })
  bookingFee: number;

  @Prop({ type: [OperatingHourSchema], default: [] })
  openHours: OperatingHourEntity[];

  @Prop({ required: true, type: String, default: "ACTIVE" })
  status: AmenityStatus;

  @Prop()
  rules?: string;
}

export type AmenityDocument = Amenity & Document;
export const AmenitySchema = SchemaFactory.createForClass(Amenity);

// Virtual lookups for polymorphic Media documents
AmenitySchema.virtual("thumbnailFile", {
  ref: "Media",
  localField: "thumbnail",
  foreignField: "_id",
  justOne: true,
});

AmenitySchema.virtual("galleryFiles", {
  ref: "Media",
  localField: "gallery",
  foreignField: "_id",
});

AmenitySchema.set("toJSON", { virtuals: true });
AmenitySchema.set("toObject", { virtuals: true });
