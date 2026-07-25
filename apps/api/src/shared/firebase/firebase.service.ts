import { Injectable, Logger } from '@nestjs/common';
import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import type { App } from 'firebase-admin/app';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private app: App | null = null;

  constructor() {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
      this.app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
      this.logger.log(`Firebase Admin initialized for project: ${projectId}`);
    } else {
      this.logger.warn(
        'Firebase credentials missing. FirebaseService will run in MOCK mode (logging to console).',
      );
    }
  }

  async sendPush(
    token: string,
    payload: { title: string; body: string; data?: Record<string, string> },
  ): Promise<void> {
    if (!this.app) {
      this.logger.log(
        `[MOCK FIREBASE PUSH]\nTo: ${token.slice(0, 20)}...\nTitle: ${payload.title}\nBody: ${payload.body}\nData: ${JSON.stringify(payload.data)}`,
      );
      return;
    }

    try {
      await getMessaging(this.app).send({
        token,
        notification: { title: payload.title, body: payload.body },
        data: payload.data,
        android: { priority: 'high' },
        apns: { payload: { aps: { sound: 'default', badge: 1 } } },
      });
      this.logger.log(`Push sent successfully to ${token.slice(0, 20)}...`);
    } catch (error) {
      this.logger.error(
        `Failed to send push to ${token.slice(0, 20)}...`,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async sendMulticast(
    tokens: string[],
    payload: { title: string; body: string; data?: Record<string, string> },
  ): Promise<void> {
    if (!this.app) {
      this.logger.log(
        `[MOCK FIREBASE MULTICAST]\nTokens: ${tokens.length}\nTitle: ${payload.title}\nBody: ${payload.body}`,
      );
      return;
    }

    try {
      const result = await getMessaging(this.app).sendEachForMulticast({
        tokens: tokens.filter(Boolean),
        notification: { title: payload.title, body: payload.body },
        data: payload.data,
        android: { priority: 'high' },
        apns: { payload: { aps: { sound: 'default', badge: 1 } } },
      });
      this.logger.log(
        `Multicast sent: ${result.successCount} success, ${result.failureCount} failures`,
      );
    } catch (error) {
      this.logger.error(
        'Failed to send multicast push',
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
