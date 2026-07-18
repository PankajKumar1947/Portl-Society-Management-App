import z from "zod";

export const USER_ROLES = ["ADMIN", "GUARD", "RESIDENTS"] as const;
export const UserRoleSchema = z.enum(USER_ROLES);

export const UserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  alternatePhone: z.string().optional(),
  emailVerified: z.boolean().default(false),
  role: UserRoleSchema,
  password: z.string().min(6, "Password must be at least 6 characters long"),
  dob: z.string().date().optional(),
  gender: z.string().optional(),
  profilePhoto: z.string().optional(),
});

export const CreateUserSchema = UserSchema.omit({
  emailVerified: true,
});

export const UpdateUserSchema = UserSchema.partial().omit({
  userId: true,
});
