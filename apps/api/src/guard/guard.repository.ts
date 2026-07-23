import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Guard, GuardDocument } from './entities/guard.entity';
import { CreateGuardDto } from './dto/create-guard.dto';
import { UpdateGuardDto } from './dto/update-guard.dto';

@Injectable()
export class GuardRepository {
  constructor(
    @InjectModel(Guard.name)
    public readonly model: Model<GuardDocument>,
  ) { }

  async create(data: Partial<Guard>): Promise<GuardDocument> {
    const created = new this.model(data);
    return created.save();
  }

  async find(filter: Record<string, any>): Promise<GuardDocument[]> {
    return this.model.find(filter).populate('userDetails').sort({ createdAt: -1 }).exec();
  }

  async findOne(guardId: string): Promise<GuardDocument | null> {
    return this.model.findOne({ guardId }).populate('userDetails').exec();
  }

  async update(
    guardId: string,
    dto: UpdateGuardDto,
  ): Promise<GuardDocument | null> {
    return this.model
      .findOneAndUpdate({ guardId }, dto, { returnDocument: 'after' })
      .populate('userDetails')
      .exec();
  }

  async remove(guardId: string): Promise<GuardDocument | null> {
    return this.model.findOneAndDelete({ guardId }).exec();
  }
}
