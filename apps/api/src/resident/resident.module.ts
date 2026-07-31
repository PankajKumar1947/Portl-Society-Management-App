import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResidentController } from './resident.controller';
import { ResidentService } from './resident.service';
import { ResidentRepository } from './resident.repository';
import { FamilyMemberRepository } from './family-member.repository';
import { ResidentLogRepository } from './resident-log.repository';
import { Resident, ResidentSchema } from './entities/resident.entity';
import { Vehicle, VehicleSchema } from './entities/vehicle.entity';
import { FamilyMember, FamilyMemberEntity } from './entities/family-member.entity';
import { ResidentLog, ResidentLogSchema } from './entities/resident-log.entity';
import { SocietyModule } from '../society/society.module';
import { TokenModule } from '../shared/token/token.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resident.name, schema: ResidentSchema },
      { name: Vehicle.name, schema: VehicleSchema },
      { name: FamilyMember.name, schema: FamilyMemberEntity },
      { name: ResidentLog.name, schema: ResidentLogSchema },
    ]),
    SocietyModule,
    TokenModule,
    UserModule,
    AuthModule,
  ],
  controllers: [ResidentController],
  providers: [ResidentService, ResidentRepository, FamilyMemberRepository, ResidentLogRepository],
  exports: [ResidentService, ResidentRepository, FamilyMemberRepository, ResidentLogRepository],
})
export class ResidentModule {}
