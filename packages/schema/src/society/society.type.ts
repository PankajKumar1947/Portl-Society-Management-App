import z from "zod";
import {
  societySchema,
  createSocietySchema,
  updateSocietySchema,
  societyTypeSchema,
} from "./society.schema";

export type SocietyType = z.infer<typeof societyTypeSchema>;
export type Society = z.infer<typeof societySchema>;
export type CreateSocietyBody = z.infer<typeof createSocietySchema>;
export type UpdateSocietyBody = z.infer<typeof updateSocietySchema>;

export type CreateSocietyData = {
  message: string;
  society: Society;
};
