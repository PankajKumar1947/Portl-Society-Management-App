import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { SocietyRepository } from './society.repository';
import { CreateSocietyDto } from './dto/create-society.dto';
import { UpdateSocietyDto } from './dto/update-society.dto';
import { SocietyDocument } from './entities/society.entity';
import * as crypto from 'crypto';

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

    // 2. Generate unique societyId (Stripe style prefix 'soc_')
    const societyId = `soc_${crypto.randomBytes(10).toString('hex')}`;

    // 3. Generate a clean unique 6-character uppercase alphanumeric joining code
    let societyCode = '';
    let isUnique = false;
    while (!isUnique) {
      societyCode = crypto.randomBytes(3).toString('hex').toUpperCase();
      const codeCheck = await this.societyRepository.findByCode(societyCode);
      if (!codeCheck) {
        isUnique = true;
      }
    }

    // 4. Save to db
    return this.societyRepository.create({
      ...createSocietyDto,
      societyId,
      userId,
      societyCode,
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
    if (!society) {
      throw new NotFoundException(
        `No society registered for user ID "${userId}"`,
      );
    }
    return society;
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
