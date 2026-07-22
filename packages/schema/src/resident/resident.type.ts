import z from "zod";
import {
  residentSchema,
  createResidentSchema,
  updateResidentSchema,
  residentFormSchema,
  relationshipSchema,
  ownershipStatusSchema,
  vehicleTypeSchema,
  docTypeSchema,
} from "./resident.schema";
import { ApiResponse } from "../shared/api.type";

export type ResidentKind = "OWNER" | "TENANT" | "FAMILY_MEMBER";
export type RelationshipType = z.infer<typeof relationshipSchema>;
export type OwnershipStatus = z.infer<typeof ownershipStatusSchema>;
export type VehicleType = z.infer<typeof vehicleTypeSchema>;
export type DocType = z.infer<typeof docTypeSchema>;

export type ResidentData = z.infer<typeof residentSchema>;
export type CreateResidentBody = z.infer<typeof createResidentSchema>;
export type UpdateResidentBody = z.infer<typeof updateResidentSchema>;
export type ResidentFormValues = z.infer<typeof residentFormSchema>;
export type ResidentResponse = ApiResponse<ResidentData>;
export type ResidentListResponse = ApiResponse<ResidentData[]>;
