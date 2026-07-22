import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(public readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { email, role } = createUserDto;
    const existingUser = await this.userRepository.findOne(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const rolePrefixes: Record<string, string> = {
      ADMIN: 'adm',
      GUARD: 'grd',
      RESIDENTS: 'res',
    };
    const prefix = rolePrefixes[role] || 'usr';
    const randomId = crypto.randomBytes(10).toString('hex');
    const userId = `${prefix}_${randomId}`;

    return this.userRepository.create({
      ...createUserDto,
      userId,
    });
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userRepository.findAll();
  }

  async findOne(userId: string): Promise<UserDocument> {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    return user;
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const updatedUser = await this.userRepository.update(userId, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    return updatedUser;
  }

  async remove(userId: string): Promise<void> {
    const deletedCount = await this.userRepository.remove(userId);
    if (deletedCount === 0) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
  }
}
