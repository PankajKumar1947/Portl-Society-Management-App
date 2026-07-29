import z from "zod";
import { relationshipSchema } from "../resident/resident.schema";

export const familyMemberSchema = z.object({
  familyMemberId: z.string().min(1, "Family member ID is required"),
  societyId: z.string().min(1, "Society ID is required"),
  residentId: z.string().min(1, "Resident ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  relationship: relationshipSchema,
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  towerId: z.string().min(1, "Tower is required"),
  flatId: z.string().min(1, "Flat is required"),
});

export const addFamilyMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  relationship: relationshipSchema,
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
});
