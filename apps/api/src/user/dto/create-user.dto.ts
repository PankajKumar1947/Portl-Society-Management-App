import { createZodDto } from 'nestjs-zod';
import { CreateUserSchema, UserRole } from '@repo/schema';

export class CreateUserDto extends createZodDto(CreateUserSchema) {
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
