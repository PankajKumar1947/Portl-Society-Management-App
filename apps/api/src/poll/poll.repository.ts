import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Poll, PollDocument } from './entities/poll.entity';
import { PollVote, PollVoteDocument } from './entities/poll-vote.entity';

@Injectable()
export class PollRepository {
  constructor(
    @InjectModel(Poll.name)
    public readonly model: Model<PollDocument>,
    @InjectModel(PollVote.name)
    public readonly voteModel: Model<PollVoteDocument>,
  ) {}

  async create(data: Partial<Poll>): Promise<PollDocument> {
    const created = new this.model(data);
    return created.save();
  }

  async find(filter: Record<string, unknown>): Promise<PollDocument[]> {
    return this.model.find(filter).populate('publisher', 'firstName lastName role').sort({ createdAt: -1 }).exec();
  }

  async findOne(pollId: string): Promise<PollDocument | null> {
    return this.model.findOne({ pollId }).populate('publisher', 'firstName lastName role').exec();
  }

  async update(pollId: string, data: Record<string, unknown>): Promise<PollDocument | null> {
    return this.model
      .findOneAndUpdate({ pollId }, data, { returnDocument: 'after' })
      .populate('publisher', 'firstName lastName role')
      .exec();
  }

  async remove(pollId: string): Promise<PollDocument | null> {
    await this.voteModel.deleteMany({ pollId }).exec();
    return this.model.findOneAndDelete({ pollId }).exec();
  }

  async findVotes(pollId: string): Promise<PollVoteDocument[]> {
    return this.voteModel.find({ pollId }).exec();
  }

  async findUserVote(pollId: string, userId: string): Promise<PollVoteDocument | null> {
    return this.voteModel.findOne({ pollId, userId }).exec();
  }

  async createVote(data: Partial<PollVote>): Promise<PollVoteDocument> {
    const created = new this.voteModel(data);
    return created.save();
  }
}
