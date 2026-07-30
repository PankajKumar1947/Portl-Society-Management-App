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
  residentPersonalSchema,
  residentAllotmentSchema,
  residentVehicleSchema,
  vehicleSchema
} from "./resident.schema";
import { ApiResponse } from "../shared/api.type";

import { User } from "../user/user.type";
import { Flat } from "../flat/flat.type";
import { Tower } from "../tower/tower.type";

export type ResidentKind = "SINGLE" | "FAMILY" | "COUPLE";
export type RelationshipType = z.infer<typeof relationshipSchema>;
export type OwnershipStatus = z.infer<typeof ownershipStatusSchema>;
export type VehicleType = z.infer<typeof vehicleTypeSchema>;
export type DocType = z.infer<typeof docTypeSchema>;

export type ResidentData = z.infer<typeof residentSchema> & {
  userDetails?: User;
  flat?: Flat;
  tower?: Tower;
};
export type CreateResidentBody = z.infer<typeof createResidentSchema>;
export type UpdateResidentBody = z.infer<typeof updateResidentSchema>;
export type ResidentFormValues = z.infer<typeof residentFormSchema>;
export type ResidentResponse = ApiResponse<ResidentData>;
export type ResidentListResponse = ApiResponse<ResidentData[]>;

export type ResidentPersonalInput = z.infer<typeof residentPersonalSchema>;
export type ResidentAllotmentInput = z.infer<typeof residentAllotmentSchema>;
export type ResidentVehicleInput = z.infer<typeof residentVehicleSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;
export type Vehicle = VehicleInput & {
  vehicleId: string;
  residentId: string;
  _id: string;
  __v: number;
};
