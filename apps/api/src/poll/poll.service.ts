import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PollRepository } from './poll.repository';
import { PollDocument } from './entities/poll.entity';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { CastVoteDto } from './dto/cast-vote.dto';
import { ResidentRepository } from '../resident/resident.repository';
import { UserRoles, UserRole } from '@repo/schema';
import * as crypto from 'crypto';

const ROLE_RECIPIENT_MAP: Partial<Record<UserRole, string>> = {
  [UserRoles.GUARD]: 'guard',
  [UserRoles.RESIDENTS]: 'residents',
};

@Injectable()
export class PollService {
  constructor(
    private readonly repository: PollRepository,
    private readonly residentRepository: ResidentRepository,
  ) {}

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

  async create(dto: CreatePollDto, societyId: string, userId: string): Promise<PollDocument> {
    const options = (dto.options || []).map((opt, i) => ({
      optionId: `opt_${crypto.randomBytes(8).toString('hex')}`,
      label: opt.label,
      displayOrder: i,
    }));

    const data = {
      question: dto.question,
      description: dto.description,
      recipient: dto.recipient,
      towerIds: dto.towerIds,
      societyId,
      createdBy: userId,
      options,
      status: dto.status || 'draft',
      expiresAt: dto.expiresAt,
      publishedOn: dto.status === 'published' ? new Date().toISOString() : undefined,
    };

    const doc = await this.repository.create(data);
    const poll = await this.repository.findOne(doc.pollId);
    if (!poll) {
      throw new NotFoundException('Poll creation failed');
    }
    return poll;
  }

  async findAll(
    societyId: string,
    role: UserRole,
    query?: { search?: string; status?: string; recipient?: string; userId?: string },
  ): Promise<PollDocument[]> {
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

    let polls = await this.repository.find(filter);

    if (query?.userId && role === UserRoles.RESIDENTS) {
      const towerId = await this.getUserTowerId(query.userId);
      if (towerId) {
        polls = polls.filter(
          (p) => !p.towerIds || p.towerIds.length === 0 || p.towerIds.includes(towerId),
        );
      }
    }

    if (query?.search) {
      const term = query.search.toLowerCase();
      polls = polls.filter(
        (p) =>
          p.question.toLowerCase().includes(term) ||
          (p.description || '').toLowerCase().includes(term),
      );
    }

    return polls;
  }

  async findOne(pollId: string, role: UserRole): Promise<PollDocument> {
    const poll = await this.repository.findOne(pollId);
    if (!poll) {
      throw new NotFoundException(`Poll with ID "${pollId}" not found`);
    }

    if (!this.isAdminRole(role)) {
      const recipient = this.getRecipientFilter(role);
      if (poll.status !== 'published' || (recipient && !poll.recipient?.includes(recipient))) {
        throw new NotFoundException(`Poll with ID "${pollId}" not found`);
      }
    }

    return poll;
  }

  async update(pollId: string, dto: UpdatePollDto): Promise<PollDocument> {
    const existing = await this.repository.findOne(pollId);
    if (!existing) {
      throw new NotFoundException(`Poll with ID "${pollId}" not found`);
    }

    const updateData: Record<string, unknown> = { ...dto };

    if (dto.options) {
      updateData.options = dto.options.map((opt, i) => ({
        optionId: `opt_${crypto.randomBytes(8).toString('hex')}`,
        label: opt.label,
        displayOrder: i,
      }));
    }

    if (dto.status === 'published' && existing.status !== 'published') {
      updateData.publishedOn = new Date().toISOString();
    }
    if (dto.status === 'closed' && existing.status !== 'closed') {
      updateData.closedOn = new Date().toISOString();
    }

    const updated = await this.repository.update(pollId, updateData);
    if (!updated) {
      throw new NotFoundException(`Poll with ID "${pollId}" not found after update`);
    }
    return updated;
  }

  async remove(pollId: string): Promise<void> {
    const poll = await this.repository.findOne(pollId);
    if (!poll) {
      throw new NotFoundException(`Poll with ID "${pollId}" not found`);
    }
    await this.repository.remove(pollId);
  }

  async publish(pollId: string): Promise<PollDocument> {
    const poll = await this.repository.findOne(pollId);
    if (!poll) {
      throw new NotFoundException(`Poll with ID "${pollId}" not found`);
    }

    const updated = await this.repository.update(pollId, {
      status: 'published',
      publishedOn: new Date().toISOString(),
    });
    if (!updated) {
      throw new NotFoundException(`Poll with ID "${pollId}" not found after publish`);
    }
    return updated;
  }

  async close(pollId: string): Promise<PollDocument> {
    const poll = await this.repository.findOne(pollId);
    if (!poll) {
      throw new NotFoundException(`Poll with ID "${pollId}" not found`);
    }

    const updated = await this.repository.update(pollId, {
      status: 'closed',
      closedOn: new Date().toISOString(),
    });
    if (!updated) {
      throw new NotFoundException(`Poll with ID "${pollId}" not found after close`);
    }
    return updated;
  }

  async castVote(pollId: string, userId: string, societyId: string, dto: CastVoteDto): Promise<{ voteId: string }> {
    const poll = await this.repository.findOne(pollId);
    if (!poll) {
      throw new NotFoundException(`Poll with ID "${pollId}" not found`);
    }
    if (poll.status !== 'published') {
      throw new BadRequestException('This poll is not open for voting');
    }
    if (new Date(poll.expiresAt) < new Date()) {
      throw new BadRequestException('This poll has expired');
    }

    const validOption = poll.options.find((o) => o.optionId === dto.optionId);
    if (!validOption) {
      throw new BadRequestException('Invalid option');
    }

    const existingVote = await this.repository.findUserVote(pollId, userId);
    if (existingVote) {
      throw new ConflictException('You have already voted on this poll');
    }

    const vote = await this.repository.createVote({
      pollId,
      optionId: dto.optionId,
      userId,
      societyId,
    });

    return { voteId: vote.voteId };
  }

  async getResults(pollId: string, userId?: string): Promise<{
    pollId: string;
    totalVotes: number;
    options: { optionId: string; label: string; votes: number; percentage: number }[];
    userVotedOptionId?: string;
  }> {
    const poll = await this.repository.findOne(pollId);
    if (!poll) {
      throw new NotFoundException(`Poll with ID "${pollId}" not found`);
    }

    const votes = await this.repository.findVotes(pollId);
    const totalVotes = votes.length;

    const options = poll.options.map((opt) => {
      const voteCount = votes.filter((v) => v.optionId === opt.optionId).length;
      return {
        optionId: opt.optionId,
        label: opt.label,
        votes: voteCount,
        percentage: totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0,
      };
    });

    let userVotedOptionId: string | undefined;
    if (userId) {
      const userVote = votes.find((v) => v.userId === userId);
      userVotedOptionId = userVote?.optionId;
    }

    return { pollId, totalVotes, options, userVotedOptionId };
  }
}
