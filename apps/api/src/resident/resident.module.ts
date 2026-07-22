import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResidentController } from './resident.controller';
import { ResidentService } from './resident.service';
import { ResidentRepository } from './resident.repository';
import { Resident, ResidentSchema } from './entities/resident.entity';
import { SocietyModule } from '../society/society.module';
import { TokenModule } from '../shared/token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resident.name, schema: ResidentSchema },
    ]),
    SocietyModule,
    TokenModule,
  ],
  controllers: [ResidentController],
  providers: [ResidentService, ResidentRepository],
  exports: [ResidentService, ResidentRepository],
})
export class ResidentModule {}
