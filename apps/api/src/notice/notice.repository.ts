import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notice, NoticeDocument } from './entities/notice.entity';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticeRepository {
  constructor(
    @InjectModel(Notice.name)
    public readonly model: Model<NoticeDocument>,
  ) { }

  async create(data: Partial<Notice>): Promise<NoticeDocument> {
    const created = new this.model(data);
    return created.save();
  }

  async find(filter: Record<string, unknown>): Promise<NoticeDocument[]> {
    return this.model
      .find(filter)
      .populate('publisher', 'firstName lastName role')
      .populate('attachmentList')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(noticeId: string): Promise<NoticeDocument | null> {
    return this.model
      .findOne({ noticeId })
      .populate('publisher', 'firstName lastName role')
      .populate('attachmentList')
      .exec();
  }

  async update(noticeId: string, dto: UpdateNoticeDto): Promise<NoticeDocument | null> {
    return this.model
      .findOneAndUpdate({ noticeId }, dto, { returnDocument: 'after' })
      .populate('publisher', 'firstName lastName role')
      .populate('attachmentList')
      .exec();
  }

  async remove(noticeId: string): Promise<NoticeDocument | null> {
    return this.model.findOneAndDelete({ noticeId }).exec();
  }
}
