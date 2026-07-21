import z from "zod";
import {
  towerSchema,
  createTowerSchema,
  updateTowerSchema,
} from "./tower.schema";

export type Tower = z.infer<typeof towerSchema>;
export type CreateTowerBody = z.infer<typeof createTowerSchema>;
export type UpdateTowerBody = z.infer<typeof updateTowerSchema>;
