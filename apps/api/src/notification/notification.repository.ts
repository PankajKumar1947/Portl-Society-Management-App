import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationItem, NotificationDocument } from './entities/notification.entity';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(NotificationItem.name)
    private readonly model: Model<NotificationDocument>,
  ) {}

  async create(data: Partial<NotificationItem>): Promise<NotificationDocument> {
    const created = new this.model(data);
    return created.save();
  }

  async findByUserId(
    userId: string,
    limit = 50,
    skip = 0,
  ): Promise<NotificationDocument[]> {
    return this.model
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findOne(notificationId: string): Promise<NotificationDocument | null> {
    return this.model.findOne({ notificationId }).exec();
  }

  async markAsRead(notificationId: string): Promise<NotificationDocument | null> {
    return this.model
      .findOneAndUpdate(
        { notificationId },
        { read: true },
        { returnDocument: 'after' },
      )
      .exec();
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.model
      .updateMany({ userId, read: false }, { read: true })
      .exec();
  }

  async countUnread(userId: string): Promise<number> {
    return this.model.countDocuments({ userId, read: false }).exec();
  }
}
