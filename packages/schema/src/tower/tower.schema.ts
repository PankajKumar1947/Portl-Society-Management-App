import z from "zod";

export const towerSchema = z.object({
  towerId: z.string().min(1, "Tower ID is required"),
  societyId: z.string().min(1, "Society ID is required"),
  towerName: z.string().min(1, "Tower/Appartment Name is required").max(100),
  location: z.string().optional(),
  appNumber: z.string().optional(),
  totalFloors: z.number().nonnegative().optional(),
});

export const createTowerSchema = towerSchema.omit({
  towerId: true,
});

export const updateTowerSchema = createTowerSchema.partial().omit({
  societyId: true,
});
