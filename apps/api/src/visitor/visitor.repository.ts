import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Visitor, VisitorDocument } from './entities/visitor.entity';
import { VisitorLog, VisitorLogDocument } from './entities/visitor-log.entity';

@Injectable()
export class VisitorRepository {
  constructor(
    @InjectModel(Visitor.name)
    public readonly visitorModel: Model<VisitorDocument>,
    @InjectModel(VisitorLog.name)
    public readonly logModel: Model<VisitorLogDocument>,
  ) {}

  async findOrCreateProfile(data: Partial<Visitor>): Promise<VisitorDocument> {
    const existing = await this.visitorModel.findOne({
      name: data.name,
      mobile: data.mobile,
      societyId: data.societyId,
    }).exec();
    if (existing) {
      return existing;
    }
    const created = new this.visitorModel(data);
    return created.save();
  }

  async createLog(data: Partial<VisitorLog>): Promise<VisitorLogDocument> {
    const created = new this.logModel(data);
    return created.save();
  }

  async findLogs(
    filter: Record<string, unknown>,
  ): Promise<VisitorLogDocument[]> {
    return this.logModel
      .find(filter)
      .select('-mobile -passCode')
      .populate('visitor', 'name photoUrl')
      .populate('resident', 'firstName lastName role')
      .populate('flat')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOneLog(logId: string): Promise<VisitorLogDocument | null> {
    return this.logModel
      .findOne({ logId })
      .select('-mobile -passCode')
      .populate('visitor', 'name photoUrl')
      .populate('resident', 'firstName lastName role')
      .populate('flat')
      .exec();
  }

  async findLogByPassCode(passCode: string): Promise<VisitorLogDocument | null> {
    return this.logModel
      .findOne({ passCode })
      .select('-mobile -passCode')
      .populate('visitor', 'name photoUrl')
      .populate('resident', 'firstName lastName role')
      .populate('flat')
      .exec();
  }

  async findLogsByVisitorId(visitorId: string, societyId: string): Promise<VisitorLogDocument[]> {
    return this.logModel
      .find({ visitorId, societyId })
      .select('-mobile -passCode')
      .populate('visitor', 'name photoUrl')
      .populate('resident', 'firstName lastName role')
      .populate('flat')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateLog(
    logId: string,
    data: Partial<VisitorLog>,
  ): Promise<VisitorLogDocument | null> {
    return this.logModel
      .findOneAndUpdate({ logId }, data, { returnDocument: 'after' })
      .select('-mobile -passCode')
      .populate('visitor', 'name photoUrl')
      .populate('resident', 'firstName lastName role')
      .populate('flat')
      .exec();
  }
}
