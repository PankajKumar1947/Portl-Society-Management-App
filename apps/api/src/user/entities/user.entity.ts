import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { USER_ROLES } from '@repo/schema';
import type { UserRole } from '@repo/schema';

const SALT_ROUNDS = 10;

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  alternatePhone?: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ required: true, enum: USER_ROLES })
  role: UserRole;

  @Prop({ required: true })
  password?: string;

  @Prop({ type: Date })
  dob?: Date;

  @Prop()
  gender?: string;

  @Prop()
  profilePhoto?: string;

  @Prop({ index: true })
  societyId?: string;

  comparePassword!: (password: string) => Promise<boolean>;
}

export const UserEntity = SchemaFactory.createForClass(User);

// hooks to hash password
UserEntity.pre('save', async function (this: UserDocument) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
});

UserEntity.methods.comparePassword = async function (
  this: UserDocument,
  password: string,
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

export const UserSchema = UserEntity;
