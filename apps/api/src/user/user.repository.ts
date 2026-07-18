import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findByEmailOrUserId(
    email: string,
    userId: string,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        $or: [{ email }, { userId }],
      })
      .exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(userId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ userId }).exec();
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findOneAndUpdate({ userId }, updateUserDto, { new: true })
      .exec();
  }

  async remove(userId: string): Promise<number> {
    const result = await this.userModel.deleteOne({ userId }).exec();
    return result.deletedCount ?? 0;
  }
}
