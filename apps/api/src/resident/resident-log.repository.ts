import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResidentLog, ResidentLogDocument } from './entities/resident-log.entity';

@Injectable()
export class ResidentLogRepository {
  constructor(
    @InjectModel(ResidentLog.name)
    private readonly model: Model<ResidentLogDocument>,
  ) {}

  async create(data: Partial<ResidentLog>): Promise<ResidentLogDocument> {
    const created = new this.model(data);
    return created.save();
  }

  async find(filter: Record<string, any>): Promise<ResidentLogDocument[]> {
    return this.model.find(filter)
      .populate({
        path: 'resident',
        populate: [
          { path: 'flat', select: 'flatId flatNumber towerId' },
          { path: 'tower', select: 'towerId towerName' }
        ]
      })
      .sort({ timestamp: -1 })
      .exec();
  }

  async findLastLog(filter: Record<string, any>): Promise<ResidentLogDocument | null> {
    return this.model.findOne(filter).sort({ timestamp: -1 }).exec();
  }
}
