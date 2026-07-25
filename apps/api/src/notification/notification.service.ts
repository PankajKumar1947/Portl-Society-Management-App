import { Injectable, Logger } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { FirebaseService } from '../shared/firebase/firebase.service';
import { UserRepository } from '../user/user.repository';
import type { NotificationType } from '@repo/schema';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly repository: NotificationRepository,
    private readonly firebaseService: FirebaseService,
    private readonly userRepository: UserRepository,
  ) {}

  async sendAndSave(
    userId: string,
    payload: {
      type: NotificationType;
      title: string;
      body: string;
      data?: Record<string, unknown>;
    },
  ) {
    const notification = await this.repository.create({
      userId,
      type: payload.type,
      title: payload.title,
      body: payload.body,
      data: payload.data,
    });

    const user = await this.userRepository.findOne(userId);
    if (user?.fcmToken) {
      await this.firebaseService.sendPush(user.fcmToken, {
        title: payload.title,
        body: payload.body,
        data: {
          type: payload.type,
          notificationId: notification.notificationId,
          ...(payload.data as Record<string, string> | undefined),
        },
      });
    } else {
      this.logger.warn(`User ${userId} has no FCM token. Push skipped.`);
    }

    return notification;
  }

  async findByUserId(userId: string, limit = 50, skip = 0) {
    return this.repository.findByUserId(userId, limit, skip);
  }

  async markAsRead(notificationId: string) {
    return this.repository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string) {
    return this.repository.markAllAsRead(userId);
  }

  async countUnread(userId: string) {
    return this.repository.countUnread(userId);
  }
}
