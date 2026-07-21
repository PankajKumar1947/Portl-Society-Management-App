import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TowerController } from './tower.controller';
import { TowerService } from './tower.service';
import { TowerRepository } from './tower.repository';
import { Tower, TowerSchema } from './entities/tower.entity';
import { TokenModule } from '../shared/token/token.module';
import { SocietyModule } from '../society/society.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tower.name, schema: TowerSchema }]),
    TokenModule,
    SocietyModule,
  ],
  controllers: [TowerController],
  providers: [TowerService, TowerRepository],
  exports: [TowerService, TowerRepository],
})
export class TowerModule {}
