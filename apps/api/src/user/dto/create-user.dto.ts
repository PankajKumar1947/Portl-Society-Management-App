import { createZodDto } from 'nestjs-zod';
import { createUserSchema, UserRole } from '@repo/schema';

export class CreateUserDto extends createZodDto(createUserSchema) {
  firstName!: string;
  lastName!: string;
  email!: string;
  phoneNumber!: string;
  alternatePhone?: string;
  role!: UserRole;
  password!: string;
  dob?: string;
  gender?: string;
  profilePhoto?: string;
}
