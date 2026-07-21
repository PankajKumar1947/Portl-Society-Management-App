import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocietyController } from './society.controller';
import { SocietyService } from './society.service';
import { SocietyRepository } from './society.repository';
import { Society, SocietySchema } from './entities/society.entity';
import { TokenModule } from '../shared/token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Society.name, schema: SocietySchema }]),
    TokenModule,
  ],
  controllers: [SocietyController],
  providers: [SocietyService, SocietyRepository],
  exports: [SocietyService, SocietyRepository],
})
export class SocietyModule {}
