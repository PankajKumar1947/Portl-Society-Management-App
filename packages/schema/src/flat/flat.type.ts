import z from "zod";
import {
  flatStatusSchema,
  flatSchema,
  createFlatSchema,
  updateFlatSchema,
  residentTypeSchema,
  flatResidentSchema,
  createFlatResidentSchema,
} from "./flat.schema";

export type FlatStatus = z.infer<typeof flatStatusSchema>;
export type Flat = z.infer<typeof flatSchema>;
export type CreateFlatBody = z.infer<typeof createFlatSchema>;
export type UpdateFlatBody = z.infer<typeof updateFlatSchema>;

export type ResidentType = z.infer<typeof residentTypeSchema>;
export type FlatResident = z.infer<typeof flatResidentSchema>;
export type CreateFlatResidentBody = z.infer<typeof createFlatResidentSchema>;
