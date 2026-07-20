import z from "zod";
import {
  userSchema,
  createUserSchema,
  updateUserSchema,
  userRoleSchema,
} from "./user.schema";

export type UserRole = z.infer<typeof userRoleSchema>;
export type User = z.infer<typeof userSchema>;
export type CreateUserBody = z.infer<typeof createUserSchema>;
export type UpdateUserBody = z.infer<typeof updateUserSchema>;
