import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Flat, FlatDocument } from './entities/flat.entity';
import { CreateFlatDto } from './dto/create-flat.dto';
import { UpdateFlatDto } from './dto/update-flat.dto';

@Injectable()
export class FlatRepository {
  constructor(
    @InjectModel(Flat.name)
    private readonly flatModel: Model<FlatDocument>,
  ) {}

  async create(createFlatDto: CreateFlatDto): Promise<FlatDocument> {
    const createdFlat = new this.flatModel(createFlatDto);
    return createdFlat.save();
  }

  async findOne(flatId: string): Promise<FlatDocument | null> {
    return this.flatModel.findOne({ flatId }).exec();
  }

  async findByTowerId(towerId: string): Promise<FlatDocument[]> {
    return this.flatModel.find({ towerId }).exec();
  }

  async findBySocietyId(societyId: string): Promise<FlatDocument[]> {
    return this.flatModel.find({ societyId }).exec();
  }

  async update(
    flatId: string,
    updateFlatDto: UpdateFlatDto,
  ): Promise<FlatDocument | null> {
    return this.flatModel
      .findOneAndUpdate({ flatId }, updateFlatDto, { new: true })
      .exec();
  }

  async remove(flatId: string): Promise<number> {
    const result = await this.flatModel.deleteOne({ flatId }).exec();
    return result.deletedCount;
  }

  async removeByTowerId(towerId: string): Promise<number> {
    const result = await this.flatModel.deleteMany({ towerId }).exec();
    return result.deletedCount;
  }
}
