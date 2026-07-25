import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { VisitorRepository } from './visitor.repository';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UserRole, UserRoles } from '@repo/schema';
import { ResidentRepository } from '../resident/resident.repository';
import { FlatRepository } from '../flat/flat.repository';

@Injectable()
export class VisitorService {
  constructor(
    private readonly repository: VisitorRepository,
    private readonly residentRepository: ResidentRepository,
    private readonly flatRepository: FlatRepository,
  ) {}

  private generatePassCode(): string {
    return `VP${Math.floor(10000000 + Math.random() * 90000000)}`;
  }

  async create(
    dto: CreateVisitorDto,
    societyId: string,
    userId: string,
    role: UserRole,
  ) {
    const isResident = role === UserRoles.RESIDENTS;

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

    const profile = await this.repository.findOrCreateProfile({
      name: dto.name,
      mobile: dto.mobile,
      societyId,
    });

    const passCode = isResident ? this.generatePassCode() : undefined;

    const log = await this.repository.createLog({
      societyId,
      visitorId: profile.visitorId,
      name: profile.name,
      mobile: profile.mobile,
      flatId: resolvedFlatId,
      residentId: isResident ? userId : undefined,
      type: dto.type,
      purpose: dto.purpose,
      passCode,
      status: isResident ? 'approved' : 'pending',
    });

    const populated = await this.repository.findOneLog(log.logId);
    if (!populated) {
      throw new NotFoundException('Visitor log creation failed');
    }
    return populated;
  }

  async findAll(
    societyId: string,
    role: UserRole,
    userId: string,
    query?: { status?: string; type?: string },
  ) {
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

    return this.repository.findLogs(filter);
  }

  async findOne(logId: string, societyId: string) {
    const log = await this.repository.findOneLog(logId);
    if (!log || log.societyId !== societyId) {
      throw new NotFoundException(`Visitor log with ID "${logId}" not found`);
    }
    return log;
  }

  async updateStatus(
    logId: string,
    societyId: string,
    status: 'pending' | 'approved' | 'rejected' | 'completed',
  ) {
    const log = await this.repository.findOneLog(logId);
    if (!log || log.societyId !== societyId) {
      throw new NotFoundException(`Visitor log with ID "${logId}" not found`);
    }

    const updateData: Record<string, unknown> = { status };

    if (status === 'approved') {
      if (!log.passCode) {
        updateData.passCode = this.generatePassCode();
      }
      const entries = log.entries || [];
      if (entries.length === 0 || entries[entries.length - 1].exitedAt) {
        entries.push({ enteredAt: new Date().toISOString() });
      } else {
        entries[entries.length - 1].enteredAt = new Date().toISOString();
      }
      updateData.entries = entries;
    } else if (status === 'completed') {
      const entries = log.entries || [];
      if (entries.length > 0 && !entries[entries.length - 1].exitedAt) {
        entries[entries.length - 1].exitedAt = new Date().toISOString();
      } else {
        entries.push({ enteredAt: new Date().toISOString(), exitedAt: new Date().toISOString() });
      }
      updateData.entries = entries;
    }

    const updated = await this.repository.updateLog(logId, updateData);
    if (!updated) {
      throw new NotFoundException(`Visitor log with ID "${logId}" not found after update`);
    }
    return updated;
  }

  async findVisitsByLogId(logId: string, societyId: string) {
    const log = await this.repository.findOneLog(logId);
    if (!log || log.societyId !== societyId) {
      throw new NotFoundException(`Visitor log with ID "${logId}" not found`);
    }
    return this.repository.findLogsByVisitorId(log.visitorId, societyId);
  }

  async findAllLogs(societyId: string, role: UserRole, userId: string) {
    const filter: Record<string, unknown> = { societyId };
    if (role === UserRoles.RESIDENTS) {
      filter.residentId = userId;
    }
    return this.repository.findLogs(filter);
  }

  async scanPassCode(
    passCode: string,
    societyId: string,
    type: 'entry' | 'exit',
    scannedBy?: string,
  ) {
    const log = await this.repository.findLogByPassCode(passCode);
    if (!log || log.societyId !== societyId) {
      throw new NotFoundException(`Visitor with pass code "${passCode}" not found`);
    }

    if (log.status !== 'approved') {
      throw new BadRequestException(`Pass code is not valid. Status: ${log.status}`);
    }

    const entries = log.entries || [];

    if (type === 'exit') {
      const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null;
      if (lastEntry && !lastEntry.exitedAt) {
        lastEntry.exitedAt = new Date().toISOString();
        lastEntry.scannedBy = scannedBy;
      } else {
        throw new BadRequestException('No open entry to exit from');
      }
    } else {
      entries.push({ enteredAt: new Date().toISOString(), scannedBy });
    }

    const updated = await this.repository.updateLog(log.logId, { entries });
    if (!updated) {
      throw new NotFoundException('Visitor scan failed');
    }
    return updated;
  }
}
