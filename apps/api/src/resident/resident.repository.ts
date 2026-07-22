import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resident, ResidentDocument } from './entities/resident.entity';
import { CreateResidentDto, UpdateResidentDto } from './dto/resident.dto';

@Injectable()
export class ResidentRepository {
  constructor(
    @InjectModel(Resident.name)
    private readonly model: Model<ResidentDocument>,
  ) {}

  async create(dto: CreateResidentDto): Promise<ResidentDocument> {
    const created = new this.model(dto);
    return created.save();
  }

  async find(filter: Record<string, any>): Promise<ResidentDocument[]> {
    return this.model.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(residentId: string): Promise<ResidentDocument | null> {
    return this.model.findOne({ residentId }).exec();
  }

  async update(
    residentId: string,
    dto: UpdateResidentDto,
  ): Promise<ResidentDocument | null> {
    return this.model
      .findOneAndUpdate({ residentId }, dto, { new: true })
      .exec();
  }

  async remove(residentId: string): Promise<ResidentDocument | null> {
    return this.model.findOneAndDelete({ residentId }).exec();
  }
}
