import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { VisitorRepository } from './visitor.repository';
import { Visitor, VisitorDocument } from './entities/visitor.entity';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { UserRole, UserRoles } from '@repo/schema';
import { ResidentRepository } from '../resident/resident.repository';
import { FlatRepository } from '../flat/flat.repository';
import * as crypto from 'crypto';

@Injectable()
export class VisitorService {
  constructor(
    private readonly repository: VisitorRepository,
    private readonly residentRepository: ResidentRepository,
    private readonly flatRepository: FlatRepository,
  ) { }

  private generatePassCode(): string {
    return `VP${Math.floor(10000000 + Math.random() * 90000000)}`;
  }

  async create(
    dto: CreateVisitorDto,
    societyId: string,
    userId: string,
    role: UserRole,
  ): Promise<VisitorDocument> {
    const isResident = role === UserRoles.RESIDENTS;
    const passCode = this.generatePassCode();
    
    let resolvedFlatId = dto.flatId;
    if (isResident) {
      const residents = await this.residentRepository.find({ userId, societyId });
      if (residents.length > 0) {
        const resident = residents[0];
        const flats = await this.flatRepository.findByTowerId(resident.towerId);
        const matchingFlat = flats.find(f => f.flatNumber === resident.flatNumber);
        if (matchingFlat) {
          resolvedFlatId = matchingFlat.flatId;
        }
      }
    }
    
    const data = {
      ...dto,
      societyId,
      flatId: resolvedFlatId || 'unknown_flat',
      residentId: isResident ? userId : undefined,
      passCode,
      status: 'pending', // Starts pending until approved or pre-approved
    };

    // If pre-approved (e.g., resident creates it), set status to approved
    if (dto.purpose === 'pre-approved' || isResident) {
      data.status = 'approved';
    }

    const doc = await this.repository.create(data);
    const visitor = await this.repository.findOne(doc.visitorId);
    if (!visitor) {
      throw new NotFoundException('Visitor creation failed');
    }
    return visitor;
  }

  async findAll(
    societyId: string,
    role: UserRole,
    userId: string,
    query?: { status?: string; type?: string },
  ): Promise<VisitorDocument[]> {
    const filter: Record<string, unknown> = { societyId };

    if (role === UserRoles.RESIDENTS) {
      filter.residentId = userId;
    }

    if (query?.status) {
      const statuses = query.status.split(',');
      if (statuses.length === 1) {
        filter.status = statuses[0];
      } else {
        filter.status = { $in: statuses };
      }
    }

    if (query?.type) {
      filter.type = query.type;
    }

    return this.repository.find(filter);
  }

  async findOne(visitorId: string, societyId: string): Promise<VisitorDocument> {
    const visitor = await this.repository.findOne(visitorId);
    if (!visitor || visitor.societyId !== societyId) {
      throw new NotFoundException(`Visitor with ID "${visitorId}" not found`);
    }
    return visitor;
  }

  async updateStatus(
    visitorId: string,
    societyId: string,
    status: 'approved' | 'rejected' | 'completed',
  ): Promise<VisitorDocument> {
    const visitor = await this.repository.findOne(visitorId);
    if (!visitor || visitor.societyId !== societyId) {
      throw new NotFoundException(`Visitor with ID "${visitorId}" not found`);
    }

    const updateData: Partial<Visitor> = { status };
    if (status === 'completed') {
      updateData.exitedAt = new Date().toISOString();
    } else if (status === 'approved') {
      updateData.visitedAt = new Date().toISOString();
    }

    const updated = await this.repository.update(visitorId, updateData as UpdateVisitorDto);
    if (!updated) {
      throw new NotFoundException(`Visitor with ID "${visitorId}" not found after update`);
    }
    return updated;
  }

  async verifyPassCode(passCode: string, societyId: string): Promise<VisitorDocument> {
    const visitor = await this.repository.findByPassCode(passCode);
    if (!visitor || visitor.societyId !== societyId) {
      throw new NotFoundException(`Visitor with pass code "${passCode}" not found`);
    }

    if (visitor.status !== 'approved') {
      throw new BadRequestException(`Pass code is not valid. Status: ${visitor.status}`);
    }

    // Check-in the visitor
    const updated = await this.repository.update(visitor.visitorId, {
      status: 'approved',
      visitedAt: new Date().toISOString(),
    } as UpdateVisitorDto);

    if (!updated) {
      throw new NotFoundException(`Visitor check-in failed`);
    }
    return updated;
  }
}
