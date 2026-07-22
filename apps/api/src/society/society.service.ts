import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { SocietyRepository } from './society.repository';
import { CreateSocietyDto } from './dto/create-society.dto';
import { UpdateSocietyDto } from './dto/update-society.dto';
import { SocietyDocument } from './entities/society.entity';

@Injectable()
export class SocietyService {
  constructor(private readonly societyRepository: SocietyRepository) {}

  async create(
    createSocietyDto: CreateSocietyDto,
    userId: string,
  ): Promise<SocietyDocument> {
    // 1. Verify that user doesn't already have an active society registered
    const existingSociety = await this.societyRepository.findByUserId(userId);
    if (existingSociety) {
      throw new ConflictException('User already has a society registered');
    }

    // 2. Save to db
    return this.societyRepository.create({
      ...createSocietyDto,
      userId,
    });
  }

  async findOne(societyId: string): Promise<SocietyDocument> {
    const society = await this.societyRepository.findOne(societyId);
    if (!society) {
      throw new NotFoundException(`Society with ID "${societyId}" not found`);
    }
    return society;
  }

  async findByUserId(userId: string): Promise<SocietyDocument> {
    const society = await this.societyRepository.findByUserId(userId);
    if (society) {
      return society;
    }

    // If no society is owned directly by this user (e.g. they are a resident),
    // look up their profile and resolve using their associated societyId.
    const user = await this.societyRepository.societyModel.db
      .model('User')
      .findOne({ userId })
      .exec();

    if (user?.societyId) {
      const associatedSociety = await this.societyRepository.findOne(user.societyId);
      if (associatedSociety) {
        return associatedSociety;
      }
    }

    throw new NotFoundException(
      `No society registered for user ID "${userId}"`,
    );
  }

  async update(
    societyId: string,
    updateSocietyDto: UpdateSocietyDto,
  ): Promise<SocietyDocument> {
    const society = await this.societyRepository.update(
      societyId,
      updateSocietyDto,
    );
    if (!society) {
      throw new NotFoundException(`Society with ID "${societyId}" not found`);
    }
    return society;
  }
}
