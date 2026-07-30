import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocietyController } from './society.controller';
import { SocietyService } from './society.service';
import { SocietyRepository } from './society.repository';
import { Society, SocietySchema } from './entities/society.entity';
import { TokenModule } from '../shared/token/token.module';
import { Tower, TowerSchema } from '../tower/entities/tower.entity';
import { Flat, FlatSchema } from '../flat/entities/flat.entity';
import { Resident, ResidentSchema } from '../resident/entities/resident.entity';
import { Guard, GuardSchema } from '../guard/entities/guard.entity';
import { Vehicle, VehicleSchema } from '../resident/entities/vehicle.entity';
import { Notice, NoticeSchema } from '../notice/entities/notice.entity';
import { Poll, PollSchema } from '../poll/entities/poll.entity';
import { Complaint, ComplaintSchema } from '../complaint/entities/complaint.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Society.name, schema: SocietySchema },
      { name: Tower.name, schema: TowerSchema },
      { name: Flat.name, schema: FlatSchema },
      { name: Resident.name, schema: ResidentSchema },
      { name: Guard.name, schema: GuardSchema },
      { name: Vehicle.name, schema: VehicleSchema },
      { name: Notice.name, schema: NoticeSchema },
      { name: Poll.name, schema: PollSchema },
      { name: Complaint.name, schema: ComplaintSchema },
    ]),
    TokenModule,
  ],
  controllers: [SocietyController],
  providers: [SocietyService, SocietyRepository],
  exports: [SocietyService, SocietyRepository],
})
export class SocietyModule {}
