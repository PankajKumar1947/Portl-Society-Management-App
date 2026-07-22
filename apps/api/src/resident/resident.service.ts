import { Injectable, NotFoundException } from '@nestjs/common';
import { ResidentRepository } from './resident.repository';
import { CreateResidentDto, UpdateResidentDto } from './dto/resident.dto';
import { ResidentDocument } from './entities/resident.entity';

@Injectable()
export class ResidentService {
  constructor(private readonly repository: ResidentRepository) {}

  async create(dto: CreateResidentDto): Promise<ResidentDocument> {
    return this.repository.create(dto);
  }

  async findAll(
    societyId: string,
    query?: { type?: string; search?: string },
  ): Promise<ResidentDocument[]> {
    const filter: Record<string, any> = { societyId };

    if (query?.type && query.type !== 'ALL') {
      filter.residentType = query.type;
    }

    if (query?.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { flatNumber: searchRegex },
        { mobileNumber: searchRegex },
      ];
    }

    return this.repository.find(filter);
  }

  async findOne(residentId: string): Promise<ResidentDocument> {
    const resident = await this.repository.findOne(residentId);
    if (!resident) {
      throw new NotFoundException(`Resident with ID "${residentId}" not found`);
    }
    return resident;
  }

  async update(
    residentId: string,
    dto: UpdateResidentDto,
  ): Promise<ResidentDocument> {
    const resident = await this.repository.update(residentId, dto);
    if (!resident) {
      throw new NotFoundException(`Resident with ID "${residentId}" not found`);
    }
    return resident;
  }

  async remove(residentId: string): Promise<void> {
    const resident = await this.repository.remove(residentId);
    if (!resident) {
      throw new NotFoundException(`Resident with ID "${residentId}" not found`);
    }
  }
}
