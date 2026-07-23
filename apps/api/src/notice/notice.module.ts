import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { NoticeRepository } from './notice.repository';
import { Notice, NoticeSchema } from './entities/notice.entity';
import { AuthModule } from '../auth/auth.module';
import { TokenModule } from '../shared/token/token.module';
import { ResidentModule } from '../resident/resident.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notice.name, schema: NoticeSchema },
    ]),
    AuthModule,
    TokenModule,
    ResidentModule,
  ],
  controllers: [NoticeController],
  providers: [NoticeService, NoticeRepository],
  exports: [NoticeService, NoticeRepository],
})
export class NoticeModule {}
