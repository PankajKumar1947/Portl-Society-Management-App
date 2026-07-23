import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuardController } from './guard.controller';
import { GuardService } from './guard.service';
import { GuardRepository } from './guard.repository';
import { Guard, GuardSchema } from './entities/guard.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { TokenModule } from '../shared/token/token.module';
import { SocietyModule } from '../society/society.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Guard.name, schema: GuardSchema },
    ]),
    UserModule,
    AuthModule,
    TokenModule,
    SocietyModule,
  ],
  controllers: [GuardController],
  providers: [GuardService, GuardRepository],
  exports: [GuardService, GuardRepository],
})
export class GuardModule {}
