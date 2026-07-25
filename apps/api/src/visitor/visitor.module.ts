import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitorController } from './visitor.controller';
import { VisitorLogsController } from './visitor-logs.controller';
import { VisitorService } from './visitor.service';
import { VisitorRepository } from './visitor.repository';
import { Visitor, VisitorSchema } from './entities/visitor.entity';
import { VisitorLog, VisitorLogSchema } from './entities/visitor-log.entity';
import { ResidentModule } from '../resident/resident.module';
import { FlatModule } from '../flat/flat.module';
import { TokenModule } from '../shared/token/token.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Visitor.name, schema: VisitorSchema },
      { name: VisitorLog.name, schema: VisitorLogSchema },
    ]),
    ResidentModule,
    FlatModule,
    TokenModule,
    NotificationModule,
  ],
  controllers: [VisitorController, VisitorLogsController],
  providers: [VisitorService, VisitorRepository],
  exports: [VisitorService, VisitorRepository],
})
export class VisitorModule { }
