import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tower, TowerDocument } from './entities/tower.entity';
import { CreateTowerDto } from './dto/create-tower.dto';
import { UpdateTowerDto } from './dto/update-tower.dto';

@Injectable()
export class TowerRepository {
  constructor(
    @InjectModel(Tower.name)
    private readonly towerModel: Model<TowerDocument>,
  ) {}

  async create(
    createTowerDto: CreateTowerDto & {
      towerId: string;
    },
  ): Promise<TowerDocument> {
    const createdTower = new this.towerModel(createTowerDto);
    return createdTower.save();
  }

  async findOne(towerId: string): Promise<TowerDocument | null> {
    return this.towerModel.findOne({ towerId }).exec();
  }

  async findBySocietyId(societyId: string): Promise<TowerDocument[]> {
    return this.towerModel.find({ societyId }).exec();
  }

  async update(
    towerId: string,
    updateTowerDto: UpdateTowerDto,
  ): Promise<TowerDocument | null> {
    return this.towerModel
      .findOneAndUpdate({ towerId }, updateTowerDto, { new: true })
      .exec();
  }

  async remove(towerId: string): Promise<number> {
    const result = await this.towerModel.deleteOne({ towerId }).exec();
    return result.deletedCount;
  }
}
