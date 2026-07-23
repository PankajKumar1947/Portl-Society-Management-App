import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SocietyModule } from './society/society.module';
import { TowerModule } from './tower/tower.module';
import { FlatModule } from './flat/flat.module';
import { ResidentModule } from './resident/resident.module';
import { GuardModule } from './guard/guard.module';
import { NoticeModule } from './notice/notice.module';
import { PollModule } from './poll/poll.module';
import { MediaModule } from './media/media.module';
import { AmenityModule } from './amenity/amenity.module';
import { Connection } from 'mongoose';
import { mongooseGlobalPlugin } from './common/plugins/mongoose-global.plugin';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI!, {
      connectionFactory: (connection: Connection) => {
        connection.plugin(mongooseGlobalPlugin);
        return connection;
      },
    }),
    UserModule,
    AuthModule,
    SocietyModule,
    TowerModule,
    FlatModule,
    ResidentModule,
    GuardModule,
    NoticeModule,
    PollModule,
    MediaModule,
    AmenityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
