import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { VisitorRepository } from './visitor.repository';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UserRole, UserRoles } from '@repo/schema';
import { ResidentRepository } from '../resident/resident.repository';
import { FamilyMemberRepository } from '../resident/family-member.repository';
import { FlatRepository } from '../flat/flat.repository';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class VisitorService {
  private readonly logger = new Logger(VisitorService.name);

  constructor(
    private readonly repository: VisitorRepository,
    private readonly residentRepository: ResidentRepository,
    private readonly familyMemberRepository: FamilyMemberRepository,
    private readonly flatRepository: FlatRepository,
    private readonly notificationService: NotificationService,
  ) { }

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
    console.log('[DEBUG] Visitor Create:', { role, resolvedFlatId, isResident });
    let residentId: string | undefined;

    if (isResident) {
      const residents = await this.residentRepository.find({ userId, societyId });
      if (residents.length > 0) {
        resolvedFlatId = residents[0].flatId;
      }
      residentId = userId;
    } else if (resolvedFlatId) {
      const flat = await this.flatRepository.findOne(resolvedFlatId);
      if (flat) {
        const residents = await this.residentRepository.find({ societyId, towerId: flat.towerId, flatId: flat.flatId });
        if (residents.length > 0) {
          residentId = residents[0].userId;
        }
      }
    }

    const profile = await this.repository.findOrCreateProfile({
      name: dto.name,
      mobile: dto.mobile,
      societyId,
    });

    const passCode = isResident ? this.generatePassCode() : undefined;
    const now = new Date();
    const defaultValidFrom = now.toISOString();
    const defaultValidTo = new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString();

    const log = await this.repository.createLog({
      societyId,
      visitorId: profile.visitorId,
      name: profile.name,
      mobile: profile.mobile,
      flatId: resolvedFlatId,
      residentId,
      type: dto.type,
      purpose: dto.purpose,
      passCode,
      status: (isResident && dto.preApprove) ? 'approved' : 'pending',
      validFrom: dto.validFrom || defaultValidFrom,
      validTo: dto.validTo || defaultValidTo,
      createdBy: userId,
    });

    const populated = await this.repository.findOneLog(log.logId);
    if (!populated) {
      throw new NotFoundException('Visitor log creation failed');
    }

    if (!isResident && residentId) {
      console.log('[DEBUG] Sending Notification to:', residentId);
      await this.notificationService.sendAndSave(residentId, {
        type: 'visitor_request',
        title: 'Visitor Entry Request',
        body: `${profile.name} is at the gate requesting entry.`,
        data: { logId: log.logId, visitorId: profile.visitorId },
      });
      console.log('[DEBUG] Notification sent successfully');
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

    if (query?.type === 'residents') {
      filter.type = { $in: ['resident', 'family_member'] };

      const latestLogs = await this.repository.logModel.aggregate([
        { $match: filter },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: { $ifNull: ['$passCode', '$visitorId'] },
            latestLogId: { $first: '$logId' },
          },
        },
      ]).exec();

      const logIds = latestLogs.map((l) => l.latestLogId);
      return this.repository.findLogs({ logId: { $in: logIds } });
    }

    if (query?.type) {
      filter.type = query.type;
    } else {
      filter.type = { $nin: ['resident', 'family_member'] };
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
    notifiedUserId?: string,
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

      if (log.residentId) {
        await this.notificationService.sendAndSave(log.residentId, {
          type: 'visitor_approved',
          title: 'Visitor Approved',
          body: `${log.name}'s entry has been approved. Pass code: ${updateData.passCode || log.passCode}`,
          data: { logId, status: 'approved' },
        });
      }
      if (log.createdBy) {
        await this.notificationService.sendAndSave(log.createdBy, {
          type: 'visitor_approved',
          title: 'Visitor Approved',
          body: `${log.name}'s entry has been approved by the resident. Pass code: ${updateData.passCode || log.passCode}`,
          data: { logId, status: 'approved' },
        }).catch(err => this.logger.error(`Failed to notify creator guard: ${err.message}`));
      }
    } else if (status === 'rejected') {
      if (log.residentId) {
        await this.notificationService.sendAndSave(log.residentId, {
          type: 'visitor_rejected',
          title: 'Visitor Declined',
          body: `Entry for ${log.name} has been declined.`,
          data: { logId, status: 'rejected' },
        });
      }
      if (log.createdBy) {
        await this.notificationService.sendAndSave(log.createdBy, {
          type: 'visitor_rejected',
          title: 'Visitor Declined',
          body: `Entry for ${log.name} has been declined by the resident.`,
          data: { logId, status: 'rejected' },
        }).catch(err => this.logger.error(`Failed to notify creator guard: ${err.message}`));
      }
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

  async findAllLogs(societyId: string, role: UserRole, userId: string, query?: { search?: string; dateFrom?: string; dateTo?: string; direction?: string }) {
    const filter: Record<string, unknown> = { societyId };
    if (role === UserRoles.RESIDENTS) {
      filter.residentId = userId;
    }
    if (query?.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }
    if (query?.dateFrom || query?.dateTo) {
      filter.createdAt = {};
      if (query.dateFrom) (filter.createdAt as Record<string, string>).$gte = query.dateFrom;
      if (query.dateTo) (filter.createdAt as Record<string, string>).$lte = query.dateTo;
    }
    if (query?.direction === 'IN') {
      filter['entries.enteredAt'] = { $exists: true, $ne: null };
    } else if (query?.direction === 'OUT') {
      filter['entries.exitedAt'] = { $exists: true, $ne: null };
    }
    return this.repository.findLogs(filter);
  }

  async requestEntry(
    dto: { mobile: string; name?: string; type?: string; purpose?: string; flatId?: string },
    societyId: string,
    scannedBy?: string,
  ) {
    const profile = await this.repository.findOrCreateProfile({
      mobile: dto.mobile,
      name: dto.name || dto.mobile,
      societyId,
    });

    let resolvedFlatId = dto.flatId;
    let residentId: string | undefined;

    if (resolvedFlatId) {
      const flat = await this.flatRepository.findOne(resolvedFlatId);
      if (flat) {
        const residents = await this.residentRepository.find({ societyId, towerId: flat.towerId, flatId: flat.flatId });
        if (residents.length > 0) {
          residentId = residents[0].userId;
        }
      }
    }

    if (!residentId) {
      const existingLogs = await this.repository.findLogs({ visitorId: profile.visitorId, societyId, residentId: { $ne: null } });
      if (existingLogs.length > 0) {
        const logWithResident = existingLogs.find(l => l.residentId);
        if (logWithResident) {
          residentId = logWithResident.residentId!;
          resolvedFlatId = resolvedFlatId || logWithResident.flatId;
        }
      }
    }

    if (!residentId) {
      throw new BadRequestException(
        'Could not determine the resident for this visitor. Please select a flat.',
      );
    }

    const log = await this.repository.createLog({
      societyId,
      visitorId: profile.visitorId,
      name: profile.name,
      mobile: profile.mobile,
      flatId: resolvedFlatId,
      residentId,
      type: dto.type || 'guest',
      purpose: dto.purpose || 'Personal Visit',
      status: 'pending',
      entries: [],
    });

    const populated = await this.repository.findOneLog(log.logId);
    if (!populated) {
      throw new NotFoundException('Visitor log creation failed');
    }

    await this.notificationService.sendAndSave(residentId, {
      type: 'visitor_request',
      title: 'Visitor Entry Request',
      body: `${profile.name} is at the gate requesting entry.`,
      data: { logId: log.logId, visitorId: profile.visitorId },
    });

    this.logger.log(`Entry request sent to resident ${residentId} for visitor ${profile.visitorId}`);
    return populated;
  }

  async scanPassCode(
    passCode: string,
    societyId: string,
    type: 'entry' | 'exit',
    scannedBy?: string,
    guardUserId?: string,
  ) {
    if (passCode.startsWith('RPAS-') || passCode.startsWith('FPAS-')) {
      let name = '';
      let flatId = '';
      let residentId = '';
      let visitorType = '';
      let personId = '';

      if (passCode.startsWith('RPAS-')) {
        const residents = await this.residentRepository.find({ passCode });
        const resident = residents[0];
        if (!resident || resident.societyId !== societyId) {
          throw new NotFoundException(`Resident with pass code "${passCode}" not found`);
        }
        name = resident.userDetails
          ? `${resident.userDetails.firstName} ${resident.userDetails.lastName}`.trim()
          : 'Resident';
        flatId = resident.flatId;
        residentId = resident.userId;
        visitorType = 'resident';
        personId = resident.residentId;
      } else {
        const familyMembers = await this.familyMemberRepository.find({ passCode });
        const familyMember = familyMembers[0];
        if (!familyMember || familyMember.societyId !== societyId) {
          throw new NotFoundException(`Family member with pass code "${passCode}" not found`);
        }
        name = `${familyMember.firstName} ${familyMember.lastName}`.trim();
        flatId = familyMember.flatId;
        
        const myResident = await this.residentRepository.findOne(familyMember.residentId);
        residentId = myResident?.userId || '';
        
        visitorType = 'family_member';
        personId = familyMember.familyMemberId;
      }

      const activeLog = await this.repository.logModel.findOne({ passCode, status: 'active' }).exec();

      if (type === 'exit') {
        if (activeLog) {
          activeLog.entries = [{
            enteredAt: activeLog.entries[0]?.enteredAt,
            exitedAt: new Date().toISOString(),
            scannedBy,
          }];
          activeLog.status = 'completed';
          await activeLog.save();
          return activeLog;
        } else {
          const log = await this.repository.createLog({
            societyId,
            visitorId: personId,
            name,
            mobile: '—',
            flatId,
            residentId,
            type: visitorType,
            status: 'completed',
            passCode,
            entries: [{ enteredAt: new Date().toISOString(), exitedAt: new Date().toISOString(), scannedBy }],
          });
          return log;
        }
      } else {
        if (activeLog) {
          activeLog.status = 'completed';
          if (activeLog.entries.length > 0 && !activeLog.entries[0].exitedAt) {
            activeLog.entries[0].exitedAt = new Date().toISOString();
          }
          await activeLog.save();
        }

        const log = await this.repository.createLog({
          societyId,
          visitorId: personId,
          name,
          mobile: '—',
          flatId,
          residentId,
          type: visitorType,
          status: 'active',
          passCode,
          entries: [{ enteredAt: new Date().toISOString(), scannedBy }],
        });
        return log;
      }
    }

    const log = await this.repository.findLogByPassCode(passCode);
    if (!log || log.societyId !== societyId) {
      throw new NotFoundException(`Visitor with pass code "${passCode}" not found`);
    }

    if (log.status === 'pending') {
      if (guardUserId) {
        log.createdBy = guardUserId;
        await this.repository.updateLog(log.logId, { createdBy: guardUserId });
      }

      if (log.residentId) {
        await this.notificationService.sendAndSave(log.residentId, {
          type: 'visitor_request',
          title: 'Visitor Entry Request',
          body: `${log.name} is at the gate presenting their pass. Please approve.`,
          data: { logId: log.logId, visitorId: log.visitorId },
        });
      }
      return log;
    }

    if (log.status !== 'approved' && log.status !== 'active') {
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
