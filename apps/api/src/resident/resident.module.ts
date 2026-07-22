import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResidentController } from './resident.controller';
import { ResidentService } from './resident.service';
import { ResidentRepository } from './resident.repository';
import { Resident, ResidentSchema } from './entities/resident.entity';
import { SocietyModule } from '../society/society.module';
import { TokenModule } from '../shared/token/token.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resident.name, schema: ResidentSchema },
    ]),
    SocietyModule,
    TokenModule,
    UserModule,
    AuthModule,
  ],
  controllers: [ResidentController],
  providers: [ResidentService, ResidentRepository],
  exports: [ResidentService, ResidentRepository],
})
export class ResidentModule {}
