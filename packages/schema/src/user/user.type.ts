import z from "zod";
import {
  UserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  UserRoleSchema,
} from "./user.schema";

export type UserRole = z.infer<typeof UserRoleSchema>;
export type User = z.infer<typeof UserSchema>;
export type CreateUserBody = z.infer<typeof CreateUserSchema>;
export type UpdateUserBody = z.infer<typeof UpdateUserSchema>;
