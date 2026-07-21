import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Society, SocietyDocument } from './entities/society.entity';
import { CreateSocietyDto } from './dto/create-society.dto';
import { UpdateSocietyDto } from './dto/update-society.dto';

@Injectable()
export class SocietyRepository {
  constructor(
    @InjectModel(Society.name)
    private readonly societyModel: Model<SocietyDocument>,
  ) {}

  async create(
    createSocietyDto: CreateSocietyDto & {
      societyId: string;
      userId: string;
      societyCode: string;
    },
  ): Promise<SocietyDocument> {
    const createdSociety = new this.societyModel(createSocietyDto);
    return createdSociety.save();
  }

  async findOne(societyId: string): Promise<SocietyDocument | null> {
    return this.societyModel.findOne({ societyId }).exec();
  }

  async findByCode(societyCode: string): Promise<SocietyDocument | null> {
    return this.societyModel.findOne({ societyCode }).exec();
  }

  async findByUserId(userId: string): Promise<SocietyDocument | null> {
    return this.societyModel.findOne({ userId }).exec();
  }

  async update(
    societyId: string,
    updateSocietyDto: UpdateSocietyDto,
  ): Promise<SocietyDocument | null> {
    return this.societyModel
      .findOneAndUpdate({ societyId }, updateSocietyDto, { new: true })
      .exec();
  }
}
