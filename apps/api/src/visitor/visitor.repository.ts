import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Visitor, VisitorDocument } from './entities/visitor.entity';
import { UpdateVisitorDto } from './dto/update-visitor.dto';

@Injectable()
export class VisitorRepository {
  constructor(
    @InjectModel(Visitor.name)
    public readonly model: Model<VisitorDocument>,
  ) { }

  async create(data: Partial<Visitor>): Promise<VisitorDocument> {
    const created = new this.model(data);
    return created.save();
  }

  async find(filter: Record<string, unknown>): Promise<VisitorDocument[]> {
    return this.model
      .find(filter)
      .populate('resident', 'firstName lastName role phoneNumber')
      .populate('flat')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(visitorId: string): Promise<VisitorDocument | null> {
    return this.model
      .findOne({ visitorId })
      .populate('resident', 'firstName lastName role phoneNumber')
      .populate('flat')
      .exec();
  }

  async findByPassCode(passCode: string): Promise<VisitorDocument | null> {
    return this.model
      .findOne({ passCode })
      .populate('resident', 'firstName lastName role phoneNumber')
      .populate('flat')
      .exec();
  }

  async update(visitorId: string, dto: UpdateVisitorDto): Promise<VisitorDocument | null> {
    return this.model
      .findOneAndUpdate({ visitorId }, dto, { returnDocument: 'after' })
      .populate('resident', 'firstName lastName role phoneNumber')
      .populate('flat')
      .exec();
  }

  async remove(visitorId: string): Promise<VisitorDocument | null> {
    return this.model.findOneAndDelete({ visitorId }).exec();
  }
}
