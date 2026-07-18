import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { email, userId } = createUserDto;
    const existingUser = await this.userRepository.findByEmailOrUserId(
      email,
      userId,
    );
    if (existingUser) {
      throw new ConflictException(
        'User with this email or userId already exists',
      );
    }
    return this.userRepository.create(createUserDto);
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
