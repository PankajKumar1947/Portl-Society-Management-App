import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { FlatRepository } from './flat.repository';
import { TowerRepository } from '../tower/tower.repository';
import { CreateFlatDto } from './dto/create-flat.dto';
import { UpdateFlatDto } from './dto/update-flat.dto';
import { FlatDocument } from './entities/flat.entity';
import * as crypto from 'crypto';

@Injectable()
export class FlatService {
  constructor(
    private readonly flatRepository: FlatRepository,
    private readonly towerRepository: TowerRepository,
  ) {}

  async create(createFlatDto: CreateFlatDto): Promise<FlatDocument> {
    // Verify tower exists and belongs to the same society
    const tower = await this.towerRepository.findOne(createFlatDto.towerId);
    if (!tower) {
      throw new NotFoundException(`Tower with ID "${createFlatDto.towerId}" not found`);
    }
    if (tower.societyId !== createFlatDto.societyId) {
      throw new ForbiddenException('Tower does not belong to the specified society');
    }

    const flatId = `flt_${crypto.randomBytes(10).toString('hex')}`;

    return this.flatRepository.create({
      ...createFlatDto,
      flatId,
    });
  }

  async findOne(flatId: string): Promise<FlatDocument> {
    const flat = await this.flatRepository.findOne(flatId);
    if (!flat) {
      throw new NotFoundException(`Flat with ID "${flatId}" not found`);
    }
    return flat;
  }

  async findByTowerId(towerId: string): Promise<FlatDocument[]> {
    return this.flatRepository.findByTowerId(towerId);
  }

  async update(
    flatId: string,
    updateFlatDto: UpdateFlatDto,
  ): Promise<FlatDocument> {
    const updated = await this.flatRepository.update(flatId, updateFlatDto);
    if (!updated) {
      throw new NotFoundException(`Flat with ID "${flatId}" not found`);
    }
    return updated;
  }

  async remove(flatId: string): Promise<void> {
    await this.findOne(flatId);
    await this.flatRepository.remove(flatId);
  }
}
