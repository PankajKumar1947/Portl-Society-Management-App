import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { MailModule } from '../shared/mail/mail.module';
import { TokenModule } from '../shared/token/token.module';
import { SocietyModule } from '../society/society.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Otp, OtpSchema } from './entities/otp.entity';
import { OtpRepository } from './otp.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    UserModule,
    MailModule,
    TokenModule,
    SocietyModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, OtpRepository],
  exports: [AuthService, OtpRepository],
})
export class AuthModule {}
