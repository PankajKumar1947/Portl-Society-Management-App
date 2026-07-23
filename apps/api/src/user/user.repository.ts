import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) public readonly userModel: Model<UserDocument>,
  ) {}

  async create(
    createUserDto: CreateUserDto & { userId: string },
  ): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(identifier: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        $or: [{ email: identifier }, { userId: identifier }],
      })
      .exec();
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findOneAndUpdate({ userId }, updateUserDto, { returnDocument: "after" })
      .exec();
  }

  async remove(userId: string): Promise<number> {
    const result = await this.userModel.deleteOne({ userId }).exec();
    return result.deletedCount ?? 0;
  }
}
