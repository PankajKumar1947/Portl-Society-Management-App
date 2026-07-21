import { Injectable, NotFoundException } from '@nestjs/common';
import { TowerRepository } from './tower.repository';
import { CreateTowerDto } from './dto/create-tower.dto';
import { UpdateTowerDto } from './dto/update-tower.dto';
import { TowerDocument } from './entities/tower.entity';
import * as crypto from 'crypto';

@Injectable()
export class TowerService {
  constructor(private readonly towerRepository: TowerRepository) {}

  async create(createTowerDto: CreateTowerDto): Promise<TowerDocument> {
    const towerId = `twr_${crypto.randomBytes(10).toString('hex')}`;

    return this.towerRepository.create({
      ...createTowerDto,
      towerId,
    });
  }

  async findOne(towerId: string): Promise<TowerDocument> {
    const tower = await this.towerRepository.findOne(towerId);
    if (!tower) {
      throw new NotFoundException(`Tower with ID "${towerId}" not found`);
    }
    return tower;
  }

  async findBySocietyId(societyId: string): Promise<TowerDocument[]> {
    return this.towerRepository.findBySocietyId(societyId);
  }

  async update(
    towerId: string,
    updateTowerDto: UpdateTowerDto,
  ): Promise<TowerDocument> {
    const updated = await this.towerRepository.update(towerId, updateTowerDto);
    if (!updated) {
      throw new NotFoundException(`Tower with ID "${towerId}" not found`);
    }
    return updated;
  }

  async remove(towerId: string): Promise<void> {
    await this.findOne(towerId);
    await this.towerRepository.remove(towerId);
  }
}
