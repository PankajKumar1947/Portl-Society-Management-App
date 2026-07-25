import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';
import { NotificationItem, NotificationSchema } from './entities/notification.entity';
import { FirebaseModule } from '../shared/firebase/firebase.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { TokenModule } from '../shared/token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NotificationItem.name, schema: NotificationSchema },
    ]),
    FirebaseModule,
    UserModule,
    AuthModule,
    TokenModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService, NotificationRepository],
})
export class NotificationModule {}
