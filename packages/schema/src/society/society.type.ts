import z from "zod";
import {
  societySchema,
  createSocietySchema,
  updateSocietySchema,
  societyTypeSchema,
  societyStatusSchema,
} from "./society.schema";

export type SocietyType = z.infer<typeof societyTypeSchema>;
export type SocietyStatus = z.infer<typeof societyStatusSchema>;
export type Society = z.infer<typeof societySchema>;
export type CreateSocietyBody = z.infer<typeof createSocietySchema>;
export type UpdateSocietyBody = z.infer<typeof updateSocietySchema>;

export type CreateSocietyData = {
  message: string;
  society: Society;
};
