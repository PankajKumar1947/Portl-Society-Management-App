import { Injectable, NotFoundException } from '@nestjs/common';
import { NoticeRepository } from './notice.repository';
import { Notice, NoticeDocument } from './entities/notice.entity';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { ResidentRepository } from '../resident/resident.repository';
import { UserRoles, UserRole } from '@repo/schema';

const ROLE_RECIPIENT_MAP: Partial<Record<UserRole, string>> = {
  [UserRoles.GUARD]: 'guard',
  [UserRoles.RESIDENTS]: 'residents',
};

@Injectable()
export class NoticeService {
  constructor(
    private readonly repository: NoticeRepository,
    private readonly residentRepository: ResidentRepository,
  ) { }

  private getRecipientFilter(role: UserRole): string | null {
    return ROLE_RECIPIENT_MAP[role] ?? null;
  }

  private isAdminRole(role: UserRole): boolean {
    return role === UserRoles.ADMIN || role === UserRoles.SUPER_ADMIN;
  }

  private async getUserTowerId(userId: string): Promise<string | null> {
    const residents = await this.residentRepository.find({ userId });
    return residents.length > 0 ? residents[0].towerId : null;
  }

  async create(dto: CreateNoticeDto, societyId: string, userId: string): Promise<NoticeDocument> {
    const data = {
      ...dto,
      societyId,
      createdBy: userId,
      status: dto.status || 'draft',
      publishedOn: dto.status === 'published' ? new Date().toISOString() : undefined,
    };

    const doc = await this.repository.create(data);
    const notice = await this.repository.findOne(doc.noticeId);
    if (!notice) {
      throw new NotFoundException('Notice creation failed');
    }
    return notice;
  }

  async findAll(
    societyId: string,
    role: UserRole,
    query?: { search?: string; status?: string; recipient?: string; userId?: string },
  ): Promise<NoticeDocument[]> {
    const filter: Record<string, unknown> = { societyId };

    if (!this.isAdminRole(role)) {
      filter.status = 'published';
      const roleRecipient = this.getRecipientFilter(role);
      if (roleRecipient) {
        filter.recipient = roleRecipient;
      }
    } else {
      if (query?.status && query.status !== 'all') {
        filter.status = query.status;
      }
      if (query?.recipient && query.recipient !== 'all') {
        filter.recipient = query.recipient;
      }
    }

    let notices = await this.repository.find(filter);

    if (query?.userId && role === UserRoles.RESIDENTS) {
      const towerId = await this.getUserTowerId(query.userId);
      if (towerId) {
        notices = notices.filter(
          (n) => !n.towerIds || n.towerIds.length === 0 || n.towerIds.includes(towerId),
        );
      }
    }

    if (query?.search) {
      const term = query.search.toLowerCase();
      notices = notices.filter(
        (n) =>
          n.title.toLowerCase().includes(term) ||
          n.description.toLowerCase().includes(term),
      );
    }

    return notices;
  }

  async findOne(noticeId: string, role: UserRole): Promise<NoticeDocument> {
    const notice = await this.repository.findOne(noticeId);
    if (!notice) {
      throw new NotFoundException(`Notice with ID "${noticeId}" not found`);
    }

    if (!this.isAdminRole(role)) {
      const recipient = this.getRecipientFilter(role);
      if (notice.status !== 'published' || (recipient && !notice.recipient?.includes(recipient))) {
        throw new NotFoundException(`Notice with ID "${noticeId}" not found`);
      }
    }

    return notice;
  }

  async update(noticeId: string, dto: UpdateNoticeDto): Promise<NoticeDocument> {
    const existing = await this.repository.findOne(noticeId);
    if (!existing) {
      throw new NotFoundException(`Notice with ID "${noticeId}" not found`);
    }

    const updateData: Partial<Notice> & UpdateNoticeDto = { ...dto };

    if (dto.status === 'published' && existing.status !== 'published') {
      updateData.publishedOn = new Date().toISOString();
    }

    const updated = await this.repository.update(noticeId, updateData);
    if (!updated) {
      throw new NotFoundException(`Notice with ID "${noticeId}" not found after update`);
    }
    return updated;
  }

  async remove(noticeId: string): Promise<void> {
    const notice = await this.repository.findOne(noticeId);
    if (!notice) {
      throw new NotFoundException(`Notice with ID "${noticeId}" not found`);
    }
    await this.repository.remove(noticeId);
  }

  async publish(noticeId: string): Promise<NoticeDocument> {
    const notice = await this.repository.findOne(noticeId);
    if (!notice) {
      throw new NotFoundException(`Notice with ID "${noticeId}" not found`);
    }

    const updated = await this.repository.update(noticeId, {
      status: 'published',
      publishedOn: new Date().toISOString(),
    } as unknown as UpdateNoticeDto);
    if (!updated) {
      throw new NotFoundException(`Notice with ID "${noticeId}" not found after publish`);
    }
    return updated;
  }
}
